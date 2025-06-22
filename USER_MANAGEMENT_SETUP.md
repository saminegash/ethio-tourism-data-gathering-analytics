# User Management Setup Guide

This guide explains how to set up and use the user management system with admin user creation capabilities.

## Prerequisites

Before using the user management system, ensure you have:

1. **Supabase Project Setup** with proper environment variables
2. **Service Role Key** for admin operations
3. **Database Schema** with the profiles table
4. **Row Level Security (RLS)** properly configured

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Setup

### 1. Create the Profiles Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'super_agent', 'agent', 'user')),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

### 2. Enable Row Level Security

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles (optional, for admin dashboard)
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 3. Create Profile Trigger (Optional)

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Creating Your First Admin User

Since you need an admin to create other users, you'll need to create the first admin manually:

### Option 1: Through Supabase Dashboard

1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Create a new user"
3. Enter email and password
4. After creation, go to Table Editor → profiles
5. Find the user and update their role to `admin`

### Option 2: Through SQL

```sql
-- First, create the auth user (replace with actual values)
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
  'admin@example.com',
  crypt('your_password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Then create the profile (replace the UUID with the actual user ID)
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'your-user-uuid-here',
  'admin@example.com',
  'Admin User',
  'admin'
);
```

## Using the User Management System

### 1. Admin Login

1. Go to `/login`
2. Sign in with your admin credentials
3. You'll be redirected to `/dashboard`

### 2. Creating Users

1. In the dashboard, click on the "User Management" tab
2. Click "Create New User"
3. Fill in the form:
   - **Email**: User's email address
   - **Full Name**: User's display name
   - **Role**: Select appropriate role (admin, super_agent, agent, user)
   - **Password**: Use default (TempPassword123!) or set custom
4. Click "Create User"

### 3. Managing Existing Users

From the User Management tab, you can:

- **View all users** with their roles and creation dates
- **Reset passwords** to the default password
- **Delete users** (with confirmation)

### 4. User Permissions

Users can view their permissions by:

1. Logging into the dashboard
2. Clicking the "Your Permissions" tab
3. Viewing accessible routes, restricted routes, and special permissions

## Default Credentials

- **Default Password**: `TempPassword123!`
- Users should change this on first login (implement password change in your app)

## Role Descriptions

### Admin

- **Full system access**
- Can create, modify, and delete users
- Access to all routes and features
- Can view audit logs and system administration

### Super Agent

- **Management access**
- Can manage users (create, modify)
- Can export data
- Access to revenue analytics
- Cannot access system administration

### Agent

- **Operational access**
- Can manage tourism sites and data
- Can upload and manage tourism data
- Cannot manage users or access revenue analytics

### User

- **Basic access**
- Can view analytics and reports
- Can access dashboard and settings
- Cannot manage data or users

## Security Considerations

1. **Service Role Key**: Keep your service role key secret and never expose it to the client
2. **Password Policy**: Consider implementing stronger password requirements
3. **User Verification**: Consider adding email verification for new users
4. **Audit Logging**: Implement audit logging for user management actions
5. **Session Management**: Implement proper session timeout and management

## Troubleshooting

### User Creation Fails

- Check if service role key is properly set
- Verify database permissions and RLS policies
- Check if email already exists

### Permission Issues

- Verify user role in the profiles table
- Check if middleware routes match selector routes
- Ensure RLS policies allow proper access

### Authentication Issues

- Check environment variables
- Verify Supabase project configuration
- Check if user has a profile record

## API Endpoints (For Future Development)

Consider creating API endpoints for:

```typescript
// POST /api/admin/users - Create user
// GET /api/admin/users - List users
// PUT /api/admin/users/:id - Update user
// DELETE /api/admin/users/:id - Delete user
// POST /api/admin/users/:id/reset-password - Reset password
```

## Next Steps

1. Implement password change functionality
2. Add email verification for new users
3. Create audit logging for admin actions
4. Add bulk user operations
5. Implement user import/export functionality
