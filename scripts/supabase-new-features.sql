-- New feature pages persistence only (does not modify existing Mongo-backed tables)
-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.feature_items (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null,
  title text not null check (char_length(title) >= 2),
  notes text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_feature_items_feature_key on public.feature_items(feature_key);
create index if not exists idx_feature_items_created_at on public.feature_items(created_at desc);

create or replace function public.set_feature_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_feature_items_updated_at on public.feature_items;
create trigger trg_feature_items_updated_at
before update on public.feature_items
for each row
execute function public.set_feature_items_updated_at();

alter table public.feature_items enable row level security;

-- Admin operations should run through server-side service key.
-- Optional public read policy for debugging:
drop policy if exists "feature_items_read_anon" on public.feature_items;
create policy "feature_items_read_anon"
on public.feature_items
for select
to anon
using (true);
