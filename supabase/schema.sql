-- ============================================================================
-- Racket Strategy — Supabase schema
-- Open Supabase → SQL Editor → New query → paste this entire file → Run.
-- Safe to re-run: drops policies and recreates them.
-- ============================================================================

create table if not exists public.scenarios (
  id          text primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled scenario',
  sport       text not null,
  tags        text[] not null default '{}',
  players     jsonb not null,
  steps       jsonb not null,
  background  jsonb,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_scenarios_user_updated
  on public.scenarios (user_id, updated_at desc);

alter table public.scenarios enable row level security;

drop policy if exists "scenarios_select_own" on public.scenarios;
drop policy if exists "scenarios_insert_own" on public.scenarios;
drop policy if exists "scenarios_update_own" on public.scenarios;
drop policy if exists "scenarios_delete_own" on public.scenarios;

create policy "scenarios_select_own"
  on public.scenarios for select
  using (auth.uid() = user_id);

create policy "scenarios_insert_own"
  on public.scenarios for insert
  with check (auth.uid() = user_id);

create policy "scenarios_update_own"
  on public.scenarios for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "scenarios_delete_own"
  on public.scenarios for delete
  using (auth.uid() = user_id);

-- Quick sanity check (will only run in psql; safe in SQL Editor too):
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = 'scenarios';
