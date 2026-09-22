-- ---------------------------------------------------------------------------
-- 0004: badges by rule, learner identity, and the leaderboard.
--
-- Badges used to be handed out per activity. They are now earned by rule from
-- the learner's whole history, and the rules live in data (badge_catalog +
-- badge_requirements, generated from src/content/badges.ts by
-- `npm run seed:rewards`). The browser evaluates the same rules for optimistic
-- feedback; this file is what actually decides who owns what.
--
-- Identity: a learner may claim a public handle and wear a badge they have
-- earned as an emblem. Only those two, plus their level, XP, streak and badge
-- count, ever leave their row, and only through the leaderboard functions.
--
-- Run after 0003_progress_integrity.sql, then apply supabase/seed/*.sql.
-- ---------------------------------------------------------------------------

-- ------------------------------------------------------------- profile shape
alter table public.profiles
  add column if not exists handle text,
  add column if not exists emblem_badge_id text,
  add column if not exists leaderboard_hidden boolean not null default false,
  add column if not exists longest_streak integer not null default 0,
  add column if not exists week_xp integer not null default 0,
  add column if not exists week_start date;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_handle_format') then
    alter table public.profiles
      add constraint profiles_handle_format check (handle is null or handle ~ '^[a-z0-9_]{3,20}$');
  end if;
end;
$$;

create unique index if not exists profiles_handle_unique on public.profiles (handle) where handle is not null;
create index if not exists profiles_leaderboard_all_idx on public.profiles (xp desc) where handle is not null and leaderboard_hidden = false;
create index if not exists profiles_leaderboard_week_idx on public.profiles (week_xp desc) where handle is not null and leaderboard_hidden = false;

-- The learner can never write these directly: they go through the functions below.
revoke update (handle, emblem_badge_id, leaderboard_hidden, longest_streak, week_xp, week_start) on public.profiles from authenticated;

-- ----------------------------------------------------------- reward catalogue
-- Badges are no longer per-activity, so the old columns go.
alter table public.activity_rewards drop column if exists badge_ids;
alter table public.activity_rewards drop column if exists is_lesson;

-- What every authored activity is. Generated from the curriculum.
create table if not exists public.activity_meta (
  activity_key text primary key,
  kind text not null check (kind in ('lesson', 'practice', 'challenge', 'project', 'placement', 'review')),
  track text,
  tier text
);

-- Every badge, its rarity bonus and the rule that unlocks it.
create table if not exists public.badge_catalog (
  badge_id text primary key,
  rarity text not null check (rarity in ('common', 'rare', 'epic', 'legendary')),
  xp integer not null default 0 check (xp >= 0),
  rule jsonb not null default '{}'::jsonb
);

-- The activity keys a key-rule asks for, expanded from the curriculum.
create table if not exists public.badge_requirements (
  badge_id text not null references public.badge_catalog (badge_id) on delete cascade,
  activity_key text not null,
  primary key (badge_id, activity_key)
);

create index if not exists badge_requirements_badge_idx on public.badge_requirements (badge_id);

alter table public.activity_meta enable row level security;
alter table public.badge_catalog enable row level security;
alter table public.badge_requirements enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'activity_meta' and policyname = 'activity_meta_readable') then
    create policy activity_meta_readable on public.activity_meta for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'badge_catalog' and policyname = 'badge_catalog_readable') then
    create policy badge_catalog_readable on public.badge_catalog for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'badge_requirements' and policyname = 'badge_requirements_readable') then
    create policy badge_requirements_readable on public.badge_requirements for select using (true);
  end if;
end;
$$;

grant select on public.activity_meta, public.badge_catalog, public.badge_requirements to anon, authenticated;
revoke insert, update, delete on public.activity_meta, public.badge_catalog, public.badge_requirements from anon, authenticated;

-- ------------------------------------------------------------ rule evaluation
-- Mirrors src/lib/badges.ts: every condition a rule states must hold, and a
-- rule that states nothing never awards itself.
create or replace function public.badge_rule_met(
  p_uid uuid,
  p_badge text,
  p_rule jsonb,
  p_streak integer,
  p_week jsonb,
  p_day_count integer,
  p_lesson_hour integer,
  p_submission jsonb,
  p_days_away integer default 0
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_asked boolean := false;
  v_mode text;
  v_needed integer;
  v_have integer;
  v_count jsonb;
begin
  if p_rule ? 'keys' then
    v_asked := true;
    v_mode := coalesce(p_rule -> 'keys' ->> 'mode', 'all');
    select count(*) into v_needed from public.badge_requirements r where r.badge_id = p_badge;
    if v_needed = 0 then
      return false;
    end if;
    select count(*) into v_have
      from public.badge_requirements r
      join public.completed_stops c on c.slug = r.activity_key and c.user_id = p_uid
     where r.badge_id = p_badge;
    if v_mode = 'any' then
      if v_have < 1 then return false; end if;
    elsif v_have < v_needed then
      return false;
    end if;
  end if;

  if p_rule ? 'count' then
    v_asked := true;
    v_count := p_rule -> 'count';
    select count(*) into v_have
      from public.completed_stops c
      join public.activity_meta m on m.activity_key = c.slug
     where c.user_id = p_uid
       and m.kind = v_count ->> 'of'
       and (v_count ->> 'track' is null or m.track = v_count ->> 'track')
       and (v_count ->> 'tier' is null or m.tier = v_count ->> 'tier');
    if v_have < (v_count ->> 'n')::integer then return false; end if;
  end if;

  if p_rule ? 'streak' then
    v_asked := true;
    if coalesce(p_streak, 0) < (p_rule ->> 'streak')::integer then return false; end if;
  end if;

  if p_rule ? 'hour' then
    v_asked := true;
    if p_lesson_hour is null
       or p_lesson_hour < (p_rule -> 'hour' ->> 'from')::integer
       or p_lesson_hour > (p_rule -> 'hour' ->> 'to')::integer then
      return false;
    end if;
  end if;

  if p_rule ? 'dayCount' then
    v_asked := true;
    if coalesce(p_day_count, 0) < (p_rule ->> 'dayCount')::integer then return false; end if;
  end if;

  if p_rule ? 'perfectWeek' then
    v_asked := true;
    select count(*) into v_have
      from jsonb_array_elements_text(coalesce(p_week, '[]'::jsonb)) as day(value)
     where value ~ '^-?[0-9.]+$' and value::numeric > 0;
    if v_have < 7 then return false; end if;
  end if;

  if p_rule ? 'tracksWithProject' then
    v_asked := true;
    select count(distinct m.track) into v_have
      from public.completed_stops c
      join public.activity_meta m on m.activity_key = c.slug
     where c.user_id = p_uid and m.kind = 'project' and m.track is not null;
    if v_have < (p_rule ->> 'tracksWithProject')::integer then return false; end if;
  end if;

  if p_rule ? 'comebackDays' then
    v_asked := true;
    if coalesce(p_days_away, 0) < (p_rule ->> 'comebackDays')::integer then return false; end if;
  end if;

  if p_rule ? 'submission' then
    v_asked := true;
    if p_submission is null then return false; end if;
    if not coalesce((p_submission ->> (p_rule ->> 'submission'))::boolean, false) then return false; end if;
  end if;

  return v_asked;
end;
$$;

-- Stores every badge the learner has just earned and returns their ids. The
-- caller adds the bonus XP, so XP is written once per action.
create or replace function public.evaluate_badges(
  p_uid uuid,
  p_streak integer,
  p_week jsonb,
  p_day_count integer,
  p_lesson_hour integer,
  p_submission jsonb,
  p_days_away integer default 0
)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_badge record;
  v_earned text[] := '{}';
begin
  for v_badge in
    select b.badge_id, b.rule
      from public.badge_catalog b
     where not exists (
       select 1 from public.unlocked_badges u where u.user_id = p_uid and u.badge_id = b.badge_id
     )
  loop
    if public.badge_rule_met(p_uid, v_badge.badge_id, v_badge.rule, p_streak, p_week, p_day_count, p_lesson_hour, p_submission, p_days_away) then
      insert into public.unlocked_badges (user_id, badge_id)
      values (p_uid, v_badge.badge_id)
      on conflict (user_id, badge_id) do nothing;
      v_earned := array_append(v_earned, v_badge.badge_id);
    end if;
  end loop;
  return v_earned;
end;
$$;

/** Bonus XP for a set of badges. */
create or replace function public.badge_bonus_xp(p_badges text[])
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(b.xp), 0)::integer
    from public.badge_catalog b
   where b.badge_id = any(coalesce(p_badges, '{}'));
$$;

-- --------------------------------------------------------------- awarding XP
create or replace function public.award_activities(
  p_keys text[],
  p_client_date date,
  p_local_hour integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_today date;
  v_key text;
  v_xp integer;
  v_inserted integer;
  v_awarded integer := 0;
  v_total integer := 0;
  v_lesson_hour integer := null;
  v_profile public.profiles%rowtype;
  v_streak integer;
  v_week_start date;
  v_day integer;
  v_activity jsonb;
  v_day_count integer;
  v_earned text[];
  v_bonus integer := 0;
  v_days_away integer := 0;
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if p_keys is null or array_length(p_keys, 1) is null then
    return 0;
  end if;

  -- The learner's calendar day, trusted only within one day of the server's.
  v_today := least(greatest(coalesce(p_client_date, current_date), current_date - 1), current_date + 1);

  -- Serialize concurrent awards for this learner.
  select * into v_profile from public.profiles where id = v_uid for update;
  if not found then
    raise exception 'profile missing' using errcode = 'P0002';
  end if;

  foreach v_key in array p_keys[1:400] loop
    v_xp := null;

    if v_key ~ '^review:[0-9]{4}-[0-9]{2}-[0-9]{2}:(python|javascript|csharp|typescript)$' then
      if substring(v_key from 8 for 10)::date <> v_today then
        continue;
      end if;
      v_xp := 20;
    elsif v_key ~ '^placement:(python|javascript|csharp|typescript)$' then
      v_xp := 50;
    else
      select r.xp into v_xp from public.activity_rewards r where r.activity_key = v_key;
      if not found then
        continue;
      end if;
    end if;

    insert into public.completed_stops (user_id, slug)
    values (v_uid, v_key)
    on conflict (user_id, slug) do nothing;
    get diagnostics v_inserted = row_count;
    if v_inserted = 0 then
      continue;
    end if;

    v_awarded := v_awarded + 1;
    v_total := v_total + v_xp;
    -- Badges that care about the time of day only look at lessons.
    if v_lesson_hour is null and p_local_hour between 0 and 23
       and exists (select 1 from public.activity_meta m where m.activity_key = v_key and m.kind = 'lesson') then
      v_lesson_hour := p_local_hour;
    end if;
  end loop;

  if v_awarded = 0 then
    return 0;
  end if;

  v_streak := case
    when v_profile.last_active_date is null then 1
    when v_profile.last_active_date = v_today then greatest(v_profile.streak, 1)
    when v_profile.last_active_date = v_today - 1 then v_profile.streak + 1
    when v_profile.last_active_date > v_today then greatest(v_profile.streak, 1)
    else 1
  end;

  v_day := extract(isodow from v_today)::integer - 1;
  v_week_start := v_today - v_day;
  v_activity := case
    when v_profile.settings ->> 'weekStart' = v_week_start::text
      and jsonb_typeof(v_profile.settings -> 'weekActivity') = 'array'
      then v_profile.settings -> 'weekActivity'
    else '[0,0,0,0,0,0,0]'::jsonb
  end;
  v_activity := jsonb_set(
    v_activity,
    array[v_day::text],
    to_jsonb(coalesce((v_activity ->> v_day)::integer, 0) + v_total)
  );
  v_day_count := case
    when v_profile.settings ->> 'dayDate' = v_today::text
      then coalesce((v_profile.settings ->> 'dayCount')::integer, 0)
    else 0
  end + v_awarded;

  -- Badges are earned from the whole history, with the state this action creates.
  v_days_away := case
    when v_profile.last_active_date is null then 0
    else greatest(0, v_today - v_profile.last_active_date)
  end;
  v_earned := public.evaluate_badges(v_uid, v_streak, v_activity, v_day_count, v_lesson_hour, null, v_days_away);
  v_bonus := public.badge_bonus_xp(v_earned);
  if v_bonus > 0 then
    v_total := v_total + v_bonus;
    v_activity := jsonb_set(
      v_activity,
      array[v_day::text],
      to_jsonb(coalesce((v_activity ->> v_day)::integer, 0) + v_bonus)
    );
  end if;

  update public.profiles
     set xp = xp + v_total,
         level = (xp + v_total) / 800 + 1,
         streak = v_streak,
         longest_streak = greatest(coalesce(longest_streak, 0), v_streak),
         last_active_date = greatest(coalesce(last_active_date, v_today), v_today),
         week_start = v_week_start,
         week_xp = case when week_start = v_week_start then coalesce(week_xp, 0) + v_total else v_total end,
         settings = coalesce(settings, '{}'::jsonb)
           || jsonb_build_object(
                'weekActivity', v_activity,
                'weekStart', v_week_start::text,
                'dayDate', v_today::text,
                'dayCount', v_day_count
              )
   where id = v_uid;

  return v_awarded;
end;
$$;

-- --------------------------------------------------------------- submissions
create or replace function public.record_submission(p_slug text, p_code text, p_passed boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_failed_before boolean;
  v_profile public.profiles%rowtype;
  v_earned text[];
  v_bonus integer;
  v_day integer;
  v_activity jsonb;
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if p_slug is null or length(p_slug) = 0 or length(p_slug) > 100 or length(coalesce(p_code, '')) > 20000 then
    raise exception 'invalid submission' using errcode = '22023';
  end if;

  select exists(
    select 1 from public.submissions
     where user_id = v_uid and slug = p_slug and passed = false
  ) into v_failed_before;

  insert into public.submissions (user_id, slug, code, passed)
  values (v_uid, p_slug, coalesce(p_code, ''), p_passed);

  select * into v_profile from public.profiles where id = v_uid for update;
  if not found then
    return;
  end if;

  v_earned := public.evaluate_badges(
    v_uid,
    v_profile.streak,
    case when jsonb_typeof(v_profile.settings -> 'weekActivity') = 'array' then v_profile.settings -> 'weekActivity' else '[0,0,0,0,0,0,0]'::jsonb end,
    coalesce((v_profile.settings ->> 'dayCount')::integer, 0),
    null,
    jsonb_build_object(
      'failed', not p_passed,
      'fail-then-pass', p_passed and v_failed_before,
      'first-try', p_passed and not v_failed_before
    )
  );

  v_bonus := public.badge_bonus_xp(v_earned);
  if v_bonus > 0 then
    v_day := extract(isodow from current_date)::integer - 1;
    v_activity := case
      when jsonb_typeof(v_profile.settings -> 'weekActivity') = 'array' then v_profile.settings -> 'weekActivity'
      else '[0,0,0,0,0,0,0]'::jsonb
    end;
    v_activity := jsonb_set(v_activity, array[v_day::text], to_jsonb(coalesce((v_activity ->> v_day)::integer, 0) + v_bonus));
    update public.profiles
       set xp = xp + v_bonus,
           level = (xp + v_bonus) / 800 + 1,
           week_xp = case when week_start = current_date - v_day then coalesce(week_xp, 0) + v_bonus else v_bonus end,
           week_start = coalesce(week_start, current_date - v_day),
           settings = coalesce(settings, '{}'::jsonb) || jsonb_build_object('weekActivity', v_activity)
     where id = v_uid;
  end if;
end;
$$;

-- ------------------------------------------------------------------ identity
/** Claims a public handle. Raises a unique_violation when it is taken. */
create or replace function public.set_handle(p_handle text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_handle text;
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  v_handle := lower(btrim(coalesce(p_handle, '')));
  v_handle := regexp_replace(v_handle, '^@', '');
  if v_handle !~ '^[a-z0-9_]{3,20}$' then
    raise exception 'invalid handle' using errcode = '22023';
  end if;
  -- Names that would let someone pass as the product or its staff.
  if v_handle = any (array[
    'admin', 'administrator', 'moderator', 'mod', 'staff', 'support', 'help', 'system',
    'root', 'owner', 'official', 'dreamcode', 'dreamcoder', 'team', 'api', 'null', 'undefined'
  ]) then
    raise exception 'reserved handle' using errcode = '22023';
  end if;
  if exists (select 1 from public.profiles where handle = v_handle and id <> v_uid) then
    raise exception 'handle taken' using errcode = '23505';
  end if;
  update public.profiles set handle = v_handle where id = v_uid;
  return v_handle;
end;
$$;

/** Wears an earned badge as an emblem, or takes it off with null. */
create or replace function public.set_emblem(p_badge_id text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if p_badge_id is not null and not exists (
    select 1 from public.unlocked_badges u where u.user_id = v_uid and u.badge_id = p_badge_id
  ) then
    raise exception 'badge not earned' using errcode = '42501';
  end if;
  update public.profiles set emblem_badge_id = p_badge_id where id = v_uid;
  return p_badge_id;
end;
$$;

create or replace function public.set_leaderboard_hidden(p_hidden boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  update public.profiles set leaderboard_hidden = coalesce(p_hidden, false) where id = v_uid;
  return coalesce(p_hidden, false);
end;
$$;

-- --------------------------------------------------------------- leaderboard
-- Only a handle, an emblem and progress numbers ever leave a profile row, and
-- only for learners who have claimed a handle and not hidden themselves.
create or replace function public.leaderboard(p_scope text default 'all', p_limit integer default 50)
returns table (
  place bigint,
  handle text,
  emblem text,
  level integer,
  xp integer,
  week_xp integer,
  streak integer,
  badges integer,
  is_me boolean
)
language sql
stable
security definer
set search_path = public
as $$
  with board as (
    select
      p.id,
      p.handle,
      p.emblem_badge_id,
      p.xp,
      p.streak,
      case when p.week_start >= date_trunc('week', current_date)::date - 1 then coalesce(p.week_xp, 0) else 0 end as week_xp,
      (select count(*) from public.unlocked_badges u where u.user_id = p.id)::integer as badges
    from public.profiles p
    where p.handle is not null and p.leaderboard_hidden = false
  )
  select
    row_number() over (
      order by case when p_scope = 'week' then board.week_xp else board.xp end desc, board.xp desc, board.handle asc
    ) as place,
    board.handle,
    board.emblem_badge_id,
    (board.xp / 800) + 1 as level,
    board.xp,
    board.week_xp,
    board.streak,
    board.badges,
    board.id = auth.uid() as is_me
  from board
  order by place
  limit greatest(1, least(coalesce(p_limit, 50), 100));
$$;

/** Where the caller stands, even when they are far below the top of the board. */
create or replace function public.leaderboard_standing(p_scope text default 'all')
returns table (place bigint, total bigint, handle text, xp integer, week_xp integer)
language sql
stable
security definer
set search_path = public
as $$
  with board as (
    select
      p.id,
      p.handle,
      p.xp,
      case when p.week_start >= date_trunc('week', current_date)::date - 1 then coalesce(p.week_xp, 0) else 0 end as week_xp
    from public.profiles p
    where p.handle is not null and p.leaderboard_hidden = false
  ), ranked as (
    select
      board.*,
      row_number() over (
        order by case when p_scope = 'week' then board.week_xp else board.xp end desc, board.xp desc, board.handle asc
      ) as place,
      count(*) over () as total
    from board
  )
  select ranked.place, ranked.total, ranked.handle, ranked.xp, ranked.week_xp
  from ranked
  where ranked.id = auth.uid();
$$;

revoke all on function public.badge_rule_met(uuid, text, jsonb, integer, jsonb, integer, integer, jsonb, integer) from public, anon, authenticated;
revoke all on function public.evaluate_badges(uuid, integer, jsonb, integer, integer, jsonb, integer) from public, anon, authenticated;
revoke all on function public.badge_bonus_xp(text[]) from public, anon;
grant execute on function public.award_activities(text[], date, integer) to authenticated;
grant execute on function public.record_submission(text, text, boolean) to authenticated;
grant execute on function public.set_handle(text) to authenticated;
grant execute on function public.set_emblem(text) to authenticated;
grant execute on function public.set_leaderboard_hidden(boolean) to authenticated;
grant execute on function public.leaderboard(text, integer) to anon, authenticated;
grant execute on function public.leaderboard_standing(text) to authenticated;
