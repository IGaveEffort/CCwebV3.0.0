-- Campus Cliques Platform (MVP) — Supabase SQL
-- Run in Supabase SQL Editor (project dashboard).
-- Creates tables, views, enums, RLS policies, and storage bucket suggestion.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.application_status as enum ('submitted','accepted','declined');
exception when duplicate_object then null;
end $$;

-- Profiles table (mirrors auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null check (role in ('student','employer','admin')) default 'student',
  full_name text,
  school text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role','student'))
  on conflict (id) do update set email = excluded.email, role = excluded.role, updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Gigs
create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  budget integer not null default 0,
  created_at timestamptz not null default now()
);

-- Applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.application_status not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (gig_id, student_id)
);

-- Message threads (only created/usable after accepted)
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  employer_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gig_id, student_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

-- Tasks/deliverables
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  title text not null,
  instructions text,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.task_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  link text,
  file_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_id, student_id)
);

-- Views (helpful for UI)
create or replace view public.gigs_view as
select g.*,
  p.email as employer_email
from public.gigs g
join public.profiles p on p.id = g.employer_id;

create or replace view public.applications_view as
select a.*,
  s.email as student_email
from public.applications a
join public.profiles s on s.id = a.student_id;

create or replace view public.applications_student_view as
select a.id, a.status, a.created_at, g.title as gig_title, g.id as gig_id
from public.applications a
join public.gigs g on g.id = a.gig_id
where a.student_id = auth.uid();

create or replace view public.applications_employer_view as
select a.id, a.status, a.created_at, g.title as gig_title, g.id as gig_id, s.email as student_email
from public.applications a
join public.gigs g on g.id = a.gig_id
join public.profiles s on s.id = a.student_id
where g.employer_id = auth.uid();

create or replace view public.threads_student_view as
select t.id, t.updated_at, g.title as gig_title, p.email as other_party_email
from public.message_threads t
join public.gigs g on g.id = t.gig_id
join public.profiles p on p.id = t.employer_id
where t.student_id = auth.uid();

create or replace view public.threads_employer_view as
select t.id, t.updated_at, g.title as gig_title, p.email as other_party_email
from public.message_threads t
join public.gigs g on g.id = t.gig_id
join public.profiles p on p.id = t.student_id
where t.employer_id = auth.uid();

create or replace view public.messages_view as
select m.id, m.thread_id, m.text, m.created_at, p.email as sender_email
from public.messages m
join public.profiles p on p.id = m.sender_id;

create or replace view public.tasks_student_view as
select t.id, t.created_at, t.title, t.instructions, g.title as gig_title
from public.tasks t
join public.gigs g on g.id = t.gig_id
where exists (
  select 1 from public.applications a
  where a.gig_id = t.gig_id and a.student_id = auth.uid() and a.status = 'accepted'
);

create or replace view public.tasks_employer_view as
select t.id, t.created_at, t.title, t.instructions, g.title as gig_title
from public.tasks t
join public.gigs g on g.id = t.gig_id
where g.employer_id = auth.uid();

-- RLS
alter table public.profiles enable row level security;
alter table public.gigs enable row level security;
alter table public.applications enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.tasks enable row level security;
alter table public.task_submissions enable row level security;

-- Profiles policies
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles
for select using (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
for update using (id = auth.uid())
with check (id = auth.uid());

-- Gigs policies
drop policy if exists "gigs_select_all" on public.gigs;
create policy "gigs_select_all" on public.gigs for select using (true);

drop policy if exists "gigs_insert_employer" on public.gigs;
create policy "gigs_insert_employer" on public.gigs for insert
with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('employer','admin')) and employer_id = auth.uid());

drop policy if exists "gigs_update_owner" on public.gigs;
create policy "gigs_update_owner" on public.gigs for update
using (employer_id = auth.uid() or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
with check (employer_id = auth.uid() or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

-- Applications policies
drop policy if exists "applications_insert_student" on public.applications;
create policy "applications_insert_student" on public.applications for insert
with check (student_id = auth.uid() and exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='student'));

drop policy if exists "applications_select_student_or_owner" on public.applications;
create policy "applications_select_student_or_owner" on public.applications for select
using (
  student_id = auth.uid()
  or exists (select 1 from public.gigs g where g.id = gig_id and g.employer_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
);

drop policy if exists "applications_update_owner" on public.applications;
create policy "applications_update_owner" on public.applications for update
using (
  exists (select 1 from public.gigs g where g.id = gig_id and g.employer_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
)
with check (true);

-- Threads policies (only if accepted app exists)
drop policy if exists "threads_select_parties" on public.message_threads;
create policy "threads_select_parties" on public.message_threads for select
using (student_id = auth.uid() or employer_id = auth.uid() or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

drop policy if exists "threads_insert_on_accept" on public.message_threads;
create policy "threads_insert_on_accept" on public.message_threads for insert
with check (
  exists (
    select 1 from public.applications a
    where a.gig_id = gig_id and a.student_id = student_id and a.status = 'accepted'
  )
);

-- Messages policies (must be in thread)
drop policy if exists "messages_select_if_in_thread" on public.messages;
create policy "messages_select_if_in_thread" on public.messages for select
using (
  exists (
    select 1 from public.message_threads t
    where t.id = thread_id and (t.student_id = auth.uid() or t.employer_id = auth.uid())
  )
);

drop policy if exists "messages_insert_if_in_thread" on public.messages;
create policy "messages_insert_if_in_thread" on public.messages for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.message_threads t
    where t.id = thread_id and (t.student_id = auth.uid() or t.employer_id = auth.uid())
  )
);

-- Tasks policies
drop policy if exists "tasks_select_if_related" on public.tasks;
create policy "tasks_select_if_related" on public.tasks for select
using (
  exists (select 1 from public.gigs g where g.id = gig_id and g.employer_id = auth.uid())
  or exists (
    select 1 from public.applications a
    where a.gig_id = gig_id and a.student_id = auth.uid() and a.status = 'accepted'
  )
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
);

drop policy if exists "tasks_insert_employer" on public.tasks;
create policy "tasks_insert_employer" on public.tasks for insert
with check (
  exists (select 1 from public.gigs g where g.id = gig_id and g.employer_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
);

-- Submissions policies
drop policy if exists "submissions_select" on public.task_submissions;
create policy "submissions_select" on public.task_submissions for select
using (
  student_id = auth.uid()
  or exists (
    select 1 from public.tasks t
    join public.gigs g on g.id = t.gig_id
    where t.id = task_id and g.employer_id = auth.uid()
  )
  or exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')
);

drop policy if exists "submissions_upsert_student" on public.task_submissions;
create policy "submissions_upsert_student" on public.task_submissions for insert
with check (
  student_id = auth.uid()
  and exists (
    select 1 from public.tasks t
    join public.applications a on a.gig_id = t.gig_id
    where t.id = task_id and a.student_id = auth.uid() and a.status = 'accepted'
  )
);

drop policy if exists "submissions_update_student" on public.task_submissions;
create policy "submissions_update_student" on public.task_submissions for update
using (student_id = auth.uid())
with check (student_id = auth.uid());

-- Storage (optional)
-- In Supabase Storage create bucket: deliverables (private).
-- Then store file_path in task_submissions.file_path and generate signed URLs client-side.
