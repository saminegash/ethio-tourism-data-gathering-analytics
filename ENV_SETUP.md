# 🚨 URGENT: Environment Variables Setup

## The Problem

Your login is failing because the environment variables are not set up. The app cannot connect to Supabase without these credentials.

## Quick Fix (5 minutes)

### Step 1: Create .env.local file

Create a file called `.env.local` in your project root (same folder as package.json):

```bash
# In your terminal, run:
touch .env.local
```

### Step 2: Add your Supabase credentials

Open `.env.local` and add these lines (replace with your actual values):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Get your Supabase credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → use for `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Restart your development server

```bash
# Stop your current server (Ctrl+C) then restart:
npm run dev
# or
pnpm dev
```

## Example .env.local file

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MjQwMCwiZXhwIjoyMDE0MzM4NDAwfQ.example-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzYyNDAwLCJleHAiOjIwMTQzMzg0MDB9.example-service-role-key
```

## Verification

After setting up the environment variables:

1. Go to your login page
2. You should see the debug section showing:
   - ✓ NEXT_PUBLIC_SUPABASE_URL: Set
   - ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY: Set
3. Click "Test Supabase Connection" to verify it works
4. Try logging in with admin@test.com / TempPassword123!

## Security Notes

- ⚠️ **NEVER** commit `.env.local` to git (it's already in .gitignore)
- ⚠️ The service role key has admin privileges - keep it secret
- ✅ The anon key is safe to use in frontend code
- ✅ The project URL is public and safe to share

## Next Steps

Once environment variables are working:

1. Remove the debug component from the login page
2. Test user creation through the admin dashboard
3. Set up your first admin user properly
