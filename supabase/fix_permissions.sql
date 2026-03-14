-- FIX 1: Allow users to insert their own Profile
-- This was missing from the original schema
create policy "Users can insert own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- FIX 2: Allow users to Insert into 'Reg info'
-- We enable RLS to be safe, then add a policy allowing inserts
alter table "Reg info" enable row level security;

-- Allow any authenticated user (or anon if not logged in yet) to insert
create policy "Anyone can insert registration info"
  on "Reg info" for insert
  with check ( true );

-- FIX 3: Allow users to read their own 'Reg info' (Optional, for dashboard)
-- Note: This is harder without a user_id column in 'Reg info', 
-- so for now we might leave it or add a loose policy.
-- Generally, you should add a 'user_id' column to 'Reg info' to secure it.
