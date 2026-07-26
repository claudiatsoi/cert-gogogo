-- Teacher portal schema and permissions
-- Run this in Supabase SQL Editor after schema.sql

create extension if not exists "uuid-ossp";

-- 1) Add a role field to profiles so access can be restricted
alter table profiles
  add column if not exists role text not null default 'student'
  check (role in ('student', 'teacher', 'admin'));

-- Keep updated_at current
create or replace function update_teacher_students_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 2) Store teacher-managed student rosters for bulk onboarding
create table if not exists teacher_students (
  id uuid default uuid_generate_v4() primary key,
  teacher_id uuid references auth.users(id) not null,
  student_name text not null,
  student_email text not null,
  grade text,
  parent_email text,
  parent_phone text,
  magic_link_sent_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (teacher_id, student_email)
);

alter table teacher_students
  add column if not exists parent_phone text;

create index if not exists idx_teacher_students_teacher_id on teacher_students(teacher_id);

-- 2b) Teacher profile details used by teacher entry registration
create table if not exists teacher_profiles (
  id uuid references auth.users(id) primary key,
  email text not null,
  phone text,
  title text not null,
  school_category text not null,
  school_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table teacher_profiles
  add column if not exists phone text;

drop trigger if exists trg_teacher_profiles_updated_at on teacher_profiles;
create trigger trg_teacher_profiles_updated_at
before update on teacher_profiles
for each row execute function update_teacher_students_updated_at();

drop trigger if exists trg_teacher_students_updated_at on teacher_students;
create trigger trg_teacher_students_updated_at
before update on teacher_students
for each row execute function update_teacher_students_updated_at();

-- 3) RLS: teachers can only access their own roster rows
alter table teacher_students enable row level security;

drop policy if exists "Teachers can view own students" on teacher_students;
create policy "Teachers can view own students"
  on teacher_students for select
  using (auth.uid() = teacher_id);

drop policy if exists "Teachers can insert own students" on teacher_students;
create policy "Teachers can insert own students"
  on teacher_students for insert
  with check (auth.uid() = teacher_id);

drop policy if exists "Teachers can update own students" on teacher_students;
create policy "Teachers can update own students"
  on teacher_students for update
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

drop policy if exists "Teachers can delete own students" on teacher_students;
create policy "Teachers can delete own students"
  on teacher_students for delete
  using (auth.uid() = teacher_id);

-- Teachers can manage their own teacher profile details
alter table teacher_profiles enable row level security;

drop policy if exists "Teachers can view own teacher profile" on teacher_profiles;
create policy "Teachers can view own teacher profile"
  on teacher_profiles for select
  using (auth.uid() = id);

drop policy if exists "Teachers can insert own teacher profile" on teacher_profiles;
create policy "Teachers can insert own teacher profile"
  on teacher_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Teachers can update own teacher profile" on teacher_profiles;
create policy "Teachers can update own teacher profile"
  on teacher_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 4) Bootstrap helper (manual): set a user as teacher/admin
-- update profiles set role = 'teacher' where id = '<USER_UUID>';
-- update profiles set role = 'admin' where id = '<USER_UUID>';
