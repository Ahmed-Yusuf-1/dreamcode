-- Dreamcode backend schema (run this in the Supabase SQL editor, or via the
-- Supabase CLI). Every table has Row-Level Security so a logged-in user can only
-- read and write their own rows. A trigger creates a profile row automatically
-- whenever a new auth user signs up.

-- ---------------------------------------------------------------------------
-- profiles: one row per user (gamification + settings + freemium tier)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Dreamer',
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_active_date date,
  tier text not null default 'free' check (tier in ('free', 'pro')),
  settings jsonb not null default
    '{"soundsEnabled": true, "guideEnabled": true, "remindersEnabled": true}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- completed_stops: which lessons/practices/challenges/projects a user finished
-- ---------------------------------------------------------------------------
create table if not exists public.completed_stops (
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, slug)
);

alter table public.completed_stops enable row level security;

create policy "completed_select_own" on public.completed_stops
  for select using (auth.uid() = user_id);
create policy "completed_insert_own" on public.completed_stops
  for insert with check (auth.uid() = user_id);
create policy "completed_delete_own" on public.completed_stops
  for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- submissions: a record of code a user ran/submitted and whether it passed
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  code text not null,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.submissions enable row level security;

create policy "submissions_select_own" on public.submissions
  for select using (auth.uid() = user_id);
create policy "submissions_insert_own" on public.submissions
  for insert with check (auth.uid() = user_id);

create index if not exists submissions_user_slug_idx
  on public.submissions (user_id, slug);

-- ---------------------------------------------------------------------------
-- srs_cards: spaced-repetition state per concept (ready for the real FSRS algo)
-- ---------------------------------------------------------------------------
create table if not exists public.srs_cards (
  user_id uuid not null references auth.users (id) on delete cascade,
  card_id text not null,
  due_at timestamptz not null default now(),
  stability double precision not null default 0,
  difficulty double precision not null default 0,
  reps integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.srs_cards enable row level security;

create policy "srs_select_own" on public.srs_cards
  for select using (auth.uid() = user_id);
create policy "srs_insert_own" on public.srs_cards
  for insert with check (auth.uid() = user_id);
create policy "srs_update_own" on public.srs_cards
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- unlocked_badges: badges the user has earned
-- ---------------------------------------------------------------------------
create table if not exists public.unlocked_badges (
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.unlocked_badges enable row level security;

create policy "badges_select_own" on public.unlocked_badges
  for select using (auth.uid() = user_id);
create policy "badges_insert_own" on public.unlocked_badges
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, 'dreamer@dreamcode'), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
