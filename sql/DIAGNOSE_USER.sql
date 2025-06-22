-- DIAGNOSE USER AUTHENTICATION ISSUE
-- Run this in Supabase SQL Editor to check what's wrong

-- 1. Check if user exists in auth.users
SELECT 
  'AUTH USER CHECK' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'confirmed' 
    ELSE 'not_confirmed' 
  END as status
FROM auth.users 
WHERE email = 'admin@test.com';

-- 2. Check if profile exists
SELECT 
  'PROFILE CHECK' as check_type,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles 
WHERE email = 'admin@test.com';

-- 3. Check if there's a mismatch between auth.users and profiles
SELECT 
  'MISMATCH CHECK' as check_type,
  au.id as auth_id,
  au.email as auth_email,
  au.email_confirmed_at,
  p.id as profile_id,
  p.email as profile_email,
  p.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'admin@test.com';

-- 4. Check if profiles table exists and has correct structure
SELECT 
  'TABLE STRUCTURE' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Count total users in both tables
SELECT 
  'USER COUNTS' as check_type,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.profiles) as profiles_count;

-- 6. Check RLS policies on profiles table
SELECT 
  'RLS POLICIES' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 7. Test if we can create a test authentication (this will fail, but shows us the error)
-- This is just to see what error we get
SELECT 
  'AUTH TEST' as check_type,
  'This query shows if we can access auth functions' as note; 