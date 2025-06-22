-- ⚠️ IMPORTANT: First create the user in Supabase Dashboard
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" 
-- 3. Email: admin@test.com
-- 4. Password: TempPassword123!
-- 5. Auto Confirm User: CHECKED
-- 6. Copy the generated User ID
-- 7. Replace USER_ID_HERE below with the actual UUID

-- Clean up any existing profile (just in case)
DELETE FROM public.profiles WHERE email = 'admin@test.com';

-- Create the profile record
-- ⚠️ REPLACE 'USER_ID_HERE' WITH THE ACTUAL UUID FROM SUPABASE DASHBOARD
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'USER_ID_HERE', -- ⚠️ REPLACE THIS WITH THE ACTUAL USER ID
  'admin@test.com',
  'Admin User',
  'admin'
);

-- Verify the setup worked
SELECT 
  'Profile Created Successfully' as status,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles 
WHERE email = 'admin@test.com';

-- Check if we can see the corresponding auth user
-- This will show if the IDs match
SELECT 
  'Auth User Check' as status,
  id::text as user_id,
  email,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed' 
    ELSE 'Not Confirmed' 
  END as email_status,
  created_at
FROM auth.users 
WHERE email = 'admin@test.com';

-- Final verification: Check that both records exist with matching IDs
SELECT 
  CASE 
    WHEN au.id = p.id THEN '✅ SUCCESS: User and Profile IDs match'
    ELSE '❌ ERROR: User and Profile IDs do not match'
  END as final_status,
  au.id::text as auth_user_id,
  p.id::text as profile_id,
  au.email as auth_email,
  p.email as profile_email,
  p.role as user_role
FROM auth.users au
JOIN public.profiles p ON au.email = p.email
WHERE au.email = 'admin@test.com'; 