-- Check your current database setup

-- 1. Check what values are in your user_role enum
SELECT unnest(enum_range(NULL::user_role)) AS allowed_roles;

-- 2. Check if you have any data in the users table
SELECT id, full_name, role, phone_number, created_at 
FROM public.users 
ORDER BY created_at DESC;

-- 3. Check if profiles table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'profiles'
) AS profiles_table_exists;

-- 4. Verify your auth user
SELECT id, email, email_confirmed_at, created_at
FROM auth.users 
WHERE email = 'admin@test.com';

-- 5. If you want to create a user record in your existing users table:
INSERT INTO public.users (id, full_name, role)
VALUES (
  'e49fdeee-91ee-450e-94a5-0eb418083182',
  'Test Admin',
  'admin'  -- Change this to match your enum values if different
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 6. Verify the user was created/updated
SELECT 
  u.id,
  u.full_name,
  u.role,
  u.created_at,
  au.email,
  au.email_confirmed_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
WHERE au.email = 'admin@test.com'; 