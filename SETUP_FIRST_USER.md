# Setup First User - Quick Start Guide

Since you're getting "Invalid login credentials", you likely need to create your first user. Here's how to do it:

## Option 1: Create User via Supabase Dashboard (Recommended)

### Step 1: Go to Supabase Dashboard

1. Open your Supabase project dashboard
2. Go to **Authentication** → **Users**

### Step 2: Create Auth User

1. Click **"Create a new user"**
2. Enter:
   - **Email**: `admin@test.com` (or your preferred email)
   - **Password**: `TempPassword123!`
   - Check **"Auto Confirm User"** if available
3. Click **"Create user"**

### Step 3: Create Profile Record

1. Go to **Table Editor** → **profiles** table
2. Click **"Insert"** → **"Insert row"**
3. Fill in:
   - **id**: Copy the UUID from the user you just created (from auth.users)
   - **email**: `admin@test.com`
   - **full_name**: `Test Admin`
   - **role**: `admin`
4. Click **"Save"**

### Step 4: Test Login

- Go to your app's login page
- Use: `admin@test.com` / `TempPassword123!`

## Option 2: SQL Script (Advanced)

If you prefer SQL, run this in your Supabase SQL editor:

```sql
-- Insert test user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('TempPassword123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID (replace with actual UUID from above)
-- Then insert profile
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID_HERE', -- Replace with the UUID from auth.users
  'admin@test.com',
  'Test Admin',
  'admin'
);
```

## Option 3: Check Existing Users

Maybe you already have users but forgot the credentials:

### Check Auth Users

```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;
```

### Check Profiles

```sql
SELECT * FROM profiles ORDER BY created_at DESC;
```

## Troubleshooting

### "Invalid login credentials" means:

- ✅ The user doesn't exist in auth.users table
- ✅ The password is wrong
- ✅ The user exists but isn't confirmed (check email_confirmed_at)

### "Unable to verify user permissions" means:

- ✅ User exists in auth but no profile record
- ✅ Profile has invalid role value

### After Creating User:

1. **Test login** with the credentials you created
2. **Check redirection** - should go to `/dashboard` for admin
3. **Verify profile loading** - should show user info
4. **Test user creation** - go to User Management tab

## Default Test Credentials

After setup, you can use:

- **Email**: `admin@test.com`
- **Password**: `TempPassword123!`
- **Role**: `admin` (full access)

## Environment Check

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Next Steps

Once you have a working admin user:

1. Sign in to test the login flow
2. Go to `/dashboard` → User Management
3. Create additional users through the admin interface
4. Test different role permissions

That's it! You should now be able to sign in successfully.
