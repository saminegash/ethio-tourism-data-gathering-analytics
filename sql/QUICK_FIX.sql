-- QUICK FIX: Create profiles table and add your user
-- Copy and paste this entire script into Supabase SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'super_agent', 'agent', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create basic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Insert your user (replace with your actual user ID)
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'e49fdeee-91ee-450e-94a5-0eb418083182',
  'admin@test.com',
  'Test Admin',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 5. Verify auth user exists
SELECT 
  'Auth User Check' as status,
  id::text,
  email,
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'confirmed' ELSE 'not confirmed' END as confirmation_status
FROM auth.users 
WHERE email = 'admin@test.com';

-- 6. Verify profile was created
SELECT 
  'Profile Check' as status,
  id::text,
  email,
  full_name,
  role
FROM public.profiles 
WHERE email = 'admin@test.com';

-- 7. Test the exact query the app uses
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles 
WHERE id = 'e49fdeee-91ee-450e-94a5-0eb418083182'; 