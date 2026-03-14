-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  phone text,
  school_grade text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Competitions table
create table competitions (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  registration_fee_cents integer not null default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions table
create type question_type as enum ('word', 'science');

create table questions (
  id uuid default uuid_generate_v4() primary key,
  competition_id uuid references competitions(id) not null,
  type question_type not null,
  question_text text not null,
  correct_answer text not null,
  distractor_1 text not null,
  distractor_2 text not null,
  distractor_3 text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Submissions table
create type payment_status as enum ('unpaid', 'paid_ecert', 'paid_physical');

create table submissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  competition_id uuid references competitions(id) not null,
  raw_score integer not null,
  tier text, -- 'Honour', 'Gold', 'Silver', 'Bronze', 'Participation'
  payment_status payment_status default 'unpaid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)

-- Profiles: Users can view and update their own profile
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Competitions: Everyone can view active competitions
alter table competitions enable row level security;

create policy "Anyone can view active competitions"
  on competitions for select
  using ( is_active = true );

-- Questions: Only accessible during the competition (this logic might need refinement based on exact app flow, but for now, public read if part of active comp is simplest for client-side fetching, though ideally questions are fetched via RPC or Edge Function to prevent peeking. For simplicity here, we'll allow read).
alter table questions enable row level security;

create policy "Anyone can view questions for active competitions"
  on questions for select
  using ( exists (select 1 from competitions where id = questions.competition_id and is_active = true) );

-- Submissions: Users can view their own submissions
alter table submissions enable row level security;

create policy "Users can view own submissions"
  on submissions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own submissions"
  on submissions for insert
  with check ( auth.uid() = user_id );
