-- Dreamcode telemetry (run this in the Supabase SQL editor after 0001_init.sql).
-- One row per product event for the logged-in user. Row-Level Security keeps a
-- user's events private to them; aggregate curriculum analysis is done by the
-- owner with service-role SQL (see the example queries at the bottom).

-- ---------------------------------------------------------------------------
-- events: lightweight product analytics (lesson_started, code_run, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- A user may read and write only their own events. No update/delete (events are
-- an append-only log).
create policy "events_select_own" on public.events
  for select using (auth.uid() = user_id);
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id);

create index if not exists events_user_created_idx on public.events (user_id, created_at desc);
create index if not exists events_name_idx on public.events (name);

-- ---------------------------------------------------------------------------
-- Example aggregate queries (run as the owner / service role in the SQL editor;
-- RLS above scopes the in-app client to a single user, so these are not exposed
-- through the app). These drive curriculum improvement.
-- ---------------------------------------------------------------------------
-- Time to first success per learner (signup -> first challenge_passed):
--   select e.user_id,
--          min(e.created_at) filter (where e.name = 'challenge_passed')
--            - min(e.created_at) filter (where e.name = 'signup') as ttfs
--   from public.events e
--   group by e.user_id;
--
-- Lesson drop-off (started but not completed), by lesson slug:
--   select coalesce(props->>'slug','?') as slug,
--          count(*) filter (where name = 'lesson_started')   as started,
--          count(*) filter (where name = 'lesson_completed') as completed
--   from public.events
--   where name in ('lesson_started','lesson_completed')
--   group by 1
--   order by (count(*) filter (where name='lesson_started')
--           - count(*) filter (where name='lesson_completed')) desc;
