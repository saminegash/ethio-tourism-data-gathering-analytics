-- CREATE ADMIN USER PROPERLY
-- This script creates the user in the auth system and sets up the profile correctly

-- IMPORTANT: Run this in Supabase SQL Editor or Dashboard

-- First, let's clean up any existing data for this email
DELETE FROM public.profiles WHERE email = 'admin@test.com';

-- We can't directly delete from auth.users via SQL, so if the user exists,
-- you'll need to delete it from the Supabase Dashboard -> Authentication -> Users

-- Method 1: Create user via SQL (if auth.users allows direct insert)
-- Note: This might not work in all Supabase setups due to security restrictions

-- Let's try to create the auth user first
-- You might need to do this via the Supabase Dashboard instead

-- Method 2: Use Supabase Dashboard (RECOMMENDED)
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Click "Add User"
-- 3. Email: admin@test.com
-- 4. Password: TempPassword123!
-- 5. Email Confirm: true (check the box)
-- 6. Copy the generated User ID

-- Method 3: Create profile manually after user creation
-- Replace 'USER_ID_HERE' with the actual UUID from step 2 above

-- Example (replace with your actual user ID):
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'e49fdeee-91ee-450e-94a5-0eb418083182', -- Replace with actual user ID
  'admin@test.com',
  'Admin User',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify the setup
SELECT 
  'VERIFICATION' as status,
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at
FROM public.profiles p
WHERE p.email = 'admin@test.com';

-- Check if we can see the auth user (this might not work due to RLS)
-- SELECT 
--   'AUTH_USER' as status,
--   id,
--   email,
--   email_confirmed_at,
--   created_at
-- FROM auth.users 
-- WHERE email = 'admin@test.com';

-- STEP-BY-STEP INSTRUCTIONS:
-- 1. Go to Supabase Dashboard
-- 2. Authentication -> Users
-- 3. Delete any existing admin@test.com user
-- 4. Click "Add User"
-- 5. Fill in:
--    - Email: admin@test.com
--    - Password: TempPassword123!
--    - Confirm Email: YES (check this box)
-- 6. Copy the generated User ID
-- 7. Run the INSERT statement above with the correct User ID
-- 8. Test login in your app 