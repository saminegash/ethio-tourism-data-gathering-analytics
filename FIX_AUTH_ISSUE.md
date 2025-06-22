# 🔧 Fix Authentication Issues - Step by Step Guide

## 🚨 Current Problem

- ❌ "Invalid login credentials" when trying to authenticate
- ❌ User may not exist in the Supabase Auth system
- ✅ Supabase connection works
- ✅ Profiles table exists but is empty

## 🎯 Root Cause

The test user (`admin@test.com`) doesn't exist in your Supabase Auth system, or exists but isn't properly configured.

## 📋 Step-by-Step Fix

### Step 1: Verify Environment Variables

Check if you have a `.env.local` file in your project root:

```bash
# Check if the file exists
ls -la .env.local
```

If it doesn't exist or is missing variables, create/update it:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Get these values from:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the values accordingly

### Step 2: Create the Admin User in Supabase Dashboard

**🚨 IMPORTANT: This must be done in Supabase Dashboard, not SQL**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Users**
4. **Delete any existing `admin@test.com` user** (if present)
5. Click **"Add User"** (or "Create new user")
6. Fill in:
   - **Email**: `admin@test.com`
   - **Password**: `TempPassword123!`
   - **✅ Auto Confirm User**: Make sure this is CHECKED
7. Click **"Create User"**
8. **Copy the generated User ID** (you'll need this for the next step)

### Step 3: Create Profile Record

Run this SQL in Supabase → **SQL Editor**:

```sql
-- Replace 'USER_ID_FROM_STEP_2' with the actual UUID you copied
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'USER_ID_FROM_STEP_2', -- ⚠️ Replace with the actual User ID from Step 2
  'admin@test.com',
  'Admin User',
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Verify it worked
SELECT
  'SUCCESS' as status,
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE email = 'admin@test.com';
```

### Step 4: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C) then restart
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Step 5: Test the Fix

1. Go to your login page
2. Click **"Run Full Diagnosis"** in the debug section
3. You should now see:

   - ✅ Testing Supabase Connection
   - ✅ Checking User Existence
   - ✅ Testing Authentication
   - ✅ Checking Profiles Table

4. Try logging in with:
   - **Email**: `admin@test.com`
   - **Password**: `TempPassword123!`

## 🔍 If Still Not Working

### Check #1: Verify User in Dashboard

1. Go to Supabase → Authentication → Users
2. Find `admin@test.com`
3. Make sure:
   - Email is confirmed (green checkmark)
   - User has a valid UUID

### Check #2: Verify Profile Record

Run this in SQL Editor:

```sql
SELECT
  'Auth User' as type,
  id::text,
  email,
  email_confirmed_at IS NOT NULL as confirmed
FROM auth.users
WHERE email = 'admin@test.com'

UNION ALL

SELECT
  'Profile' as type,
  id::text,
  email,
  role::text as confirmed
FROM public.profiles
WHERE email = 'admin@test.com';
```

Both queries should return data with matching IDs.

### Check #3: Environment Variables

Run this in your app's debug section or browser console:

```javascript
console.log({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
```

## 🎉 Success Criteria

After the fix, you should:

1. ✅ Be able to log in with `admin@test.com` / `TempPassword123!`
2. ✅ See "Welcome Admin User" after login
3. ✅ Be redirected to `/dashboard`
4. ✅ All diagnostic tests pass

## 🆘 Still Having Issues?

If you're still getting "Invalid login credentials":

1. **Double-check the password**: It's case-sensitive (`TempPassword123!`)
2. **Try creating a different user** in Supabase Dashboard
3. **Check browser console** for any JavaScript errors
4. **Try incognito mode** to rule out caching issues

The key is that the user MUST be created through the Supabase Dashboard with email confirmation enabled - SQL inserts into auth.users typically don't work due to security restrictions.
