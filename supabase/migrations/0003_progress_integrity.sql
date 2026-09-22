-- Dreamcode 0003: progress integrity. Run after 0001_init.sql and 0002_telemetry.sql.
--
-- Before this migration a signed-in learner could use their own session with the
-- public anon key to write XP, level, streak and even `tier = 'pro'` directly into
-- their profile row, insert any completion or badge, and two devices awarding at
-- the same moment could lose an increment. After it:
--
--   * learners may update only `name` and `settings` on their own profile;
--   * completions, XP, streaks and badges change only through the SECURITY
--     DEFINER functions below, which read rewards from the server-owned
--     activity_rewards table and lock the profile row (one transaction per award);
--   * activity_rewards is filled from the curriculum by
--     supabase/seed/activity_rewards.sql (regenerate it with
--     `npm run seed:rewards` whenever lessons, challenges or projects change,
--     then run it in the SQL editor).

-- ---------------------------------------------------------------------------
-- Column-level privileges on profiles
-- ---------------------------------------------------------------------------
revoke insert, update on public.profiles from anon, authenticated;
grant update (name, settings) on public.profiles to authenticated;
drop policy if exists "profiles_insert_own" on public.profiles;

-- ---------------------------------------------------------------------------
-- Completions and badges are written by the award functions only
-- ---------------------------------------------------------------------------
drop policy if exists "completed_insert_own" on public.completed_stops;
drop policy if exists "completed_delete_own" on public.completed_stops;
drop policy if exists "badges_insert_own" on public.unlocked_badges;
revoke insert, update, delete on public.completed_stops from anon, authenticated;
revoke insert, update, delete on public.unlocked_badges from anon, authenticated;

-- Submissions stay insertable by the owner (append-only history), but the
-- badge they can earn is decided by record_submission below.

-- ---------------------------------------------------------------------------
-- The reward catalog (server-owned; learners can read it, never write it)
-- ---------------------------------------------------------------------------
create table if not exists public.activity_rewards (
  activity_key text primary key,
  xp integer not null check (xp between 0 and 1000),
  badge_ids text[] not null default '{}',
  is_lesson boolean not null default false
);

alter table public.activity_rewards enable row level security;
drop policy if exists "activity_rewards_read" on public.activity_rewards;
create policy "activity_rewards_read" on public.activity_rewards for select using (true);
revoke insert, update, delete on public.activity_rewards from anon, authenticated;

-- ---------------------------------------------------------------------------
-- award_activities: complete one or more activities for the calling learner
-- ---------------------------------------------------------------------------
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
  v_badges text[];
  v_is_lesson boolean;
  v_inserted integer;
  v_awarded integer := 0;
  v_total integer := 0;
  v_all_badges text[] := '{}';
  v_profile public.profiles%rowtype;
  v_streak integer;
  v_week_start date;
  v_day integer;
  v_activity jsonb;
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
    v_badges := '{}';
    v_is_lesson := false;

    if v_key ~ '^review:[0-9]{4}-[0-9]{2}-[0-9]{2}:(python|javascript|csharp|typescript)$' then
      if substring(v_key from 8 for 10)::date <> v_today then
        continue;
      end if;
      v_xp := 20;
    elsif v_key ~ '^placement:(python|javascript|csharp|typescript)$' then
      v_xp := 50;
    else
      select r.xp, r.badge_ids, r.is_lesson
        into v_xp, v_badges, v_is_lesson
        from public.activity_rewards r
       where r.activity_key = v_key;
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
    v_all_badges := v_all_badges || coalesce(v_badges, '{}');
    if v_is_lesson and p_local_hour between 0 and 4 then
      v_all_badges := array_append(v_all_badges, 'night-owl');
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

  update public.profiles
     set xp = xp + v_total,
         level = (xp + v_total) / 800 + 1,
         streak = v_streak,
         last_active_date = greatest(coalesce(last_active_date, v_today), v_today),
         settings = coalesce(settings, '{}'::jsonb)
           || jsonb_build_object('weekActivity', v_activity, 'weekStart', v_week_start::text)
   where id = v_uid;

  if v_streak >= 7 then
    v_all_badges := array_append(v_all_badges, 'streak-keeper');
  end if;

  insert into public.unlocked_badges (user_id, badge_id)
  select v_uid, b from unnest(v_all_badges) as b
  on conflict (user_id, badge_id) do nothing;

  return v_awarded;
end;
$$;

-- ---------------------------------------------------------------------------
-- spend_xp: an in-product purchase (Dream Guide hint). Can never add XP.
-- ---------------------------------------------------------------------------
create or replace function public.spend_xp(p_amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_xp integer;
begin
  if v_uid is null then
    raise exception 'not signed in' using errcode = '42501';
  end if;
  if p_amount is null or p_amount < 1 or p_amount > 50 then
    raise exception 'invalid amount' using errcode = '22023';
  end if;
  update public.profiles
     set xp = greatest(0, xp - p_amount),
         level = greatest(0, xp - p_amount) / 800 + 1
   where id = v_uid
  returning xp into v_xp;
  return v_xp;
end;
$$;

-- ---------------------------------------------------------------------------
-- record_submission: store a graded attempt and award Test Tamer / Bug Catcher
-- ---------------------------------------------------------------------------
create or replace function public.record_submission(p_slug text, p_code text, p_passed boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_failed_before boolean;
  v_badge text;
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

  v_badge := case
    when not p_passed then 'test-tamer'
    when v_failed_before then 'bug-catcher'
    else null
  end;
  if v_badge is not null then
    insert into public.unlocked_badges (user_id, badge_id)
    values (v_uid, v_badge)
    on conflict (user_id, badge_id) do nothing;
  end if;
end;
$$;

revoke all on function public.award_activities(text[], date, integer) from public, anon;
revoke all on function public.spend_xp(integer) from public, anon;
revoke all on function public.record_submission(text, text, boolean) from public, anon;
grant execute on function public.award_activities(text[], date, integer) to authenticated;
grant execute on function public.spend_xp(integer) to authenticated;
grant execute on function public.record_submission(text, text, boolean) to authenticated;

-- New profiles still come from the signup trigger in 0001 (SECURITY DEFINER),
-- which is unaffected by the revoked insert privilege above.
