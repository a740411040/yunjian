-- 云笺 Supabase 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行本文件。

create extension if not exists "pgcrypto";

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  tags text[] not null default '{}',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_id_idx on public.notes(user_id);
create index if not exists notes_user_updated_idx on public.notes(user_id, updated_at desc);
create index if not exists notes_user_pinned_idx on public.notes(user_id, is_pinned desc, updated_at desc);
create index if not exists notes_tags_gin_idx on public.notes using gin(tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;

create trigger notes_set_updated_at
before update on public.notes
for each row
execute function public.set_updated_at();

alter table public.notes enable row level security;

drop policy if exists "Users can view own notes" on public.notes;
drop policy if exists "Users can insert own notes" on public.notes;
drop policy if exists "Users can update own notes" on public.notes;
drop policy if exists "Users can delete own notes" on public.notes;

create policy "Users can view own notes"
on public.notes for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own notes"
on public.notes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own notes"
on public.notes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own notes"
on public.notes for delete
to authenticated
using (auth.uid() = user_id);
