# 🔧 Login Troubleshooting Guide

## Current Status

✅ Environment variables are set correctly  
❌ Authentication still fails with "Invalid login credentials"

## Most Likely Causes

### 1. 🎯 **User Doesn't Exist in Auth System**

**Symptoms:** "Invalid login credentials" error  
**Solution:** Create user properly in Supabase Dashboard

**Steps:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Users**
4. Delete any existing `admin@test.com` user
5. Click **"Add User"**
6. Fill in:
   - Email: `admin@test.com`
   - Password: `TempPassword123!`
   - **Email Confirm: YES** ✅ (This is crucial!)
7. Click **"Create User"**
8. Copy the generated User ID
9. Run the profile creation SQL (see `CREATE_ADMIN_USER.sql`)

### 2. 🔐 **Email Not Confirmed**

**Symptoms:** User exists but can't log in  
**Solution:** Confirm email in Supabase Dashboard

**Steps:**

1. Go to Authentication → Users
2. Find `admin@test.com`
3. Click on the user
4. Make sure **Email Confirmed** is checked
5. If not, click **"Confirm Email"**

### 3. 📋 **Missing Profile Record**

**Symptoms:** Auth succeeds but profile fetch fails  
**Solution:** Create profile record

**Steps:**

1. Run `DIAGNOSE_USER.sql` to check what's missing
2. If user exists but no profile, run:

```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'YOUR_USER_ID_HERE', -- Replace with actual UUID
  'admin@test.com',
  'Admin User',
  'admin'
);
```

### 4. 🛡️ **Row Level Security (RLS) Issues**

**Symptoms:** Profile table access denied  
**Solution:** Check RLS policies

**Steps:**

1. Run `DIAGNOSE_USER.sql` to check policies
2. Ensure profiles table has proper RLS policies
3. If needed, run `QUICK_FIX.sql` again

### 5. 🔄 **Wrong Password**

**Symptoms:** Correct user but wrong credentials  
**Solution:** Reset password

**Steps:**

1. In Supabase Dashboard → Authentication → Users
2. Find `admin@test.com`
3. Click **"Reset Password"**
4. Set new password to `TempPassword123!`

## 🔍 **Diagnostic Steps**

### Step 1: Use the Debug Tools

1. Go to your login page
2. Click **"Run Full Diagnosis"** in the Authentication Flow Debug section
3. Look for which step fails:
   - ✅ Connection → Environment is good
   - ❌ Authentication → User/password issue
   - ❌ Profile Fetch → Database/RLS issue

### Step 2: Check Supabase Dashboard

1. Go to Authentication → Users
2. Search for `admin@test.com`
3. Check if user exists and email is confirmed
4. Note the User ID

### Step 3: Run SQL Diagnostics

1. Go to Supabase → SQL Editor
2. Run `DIAGNOSE_USER.sql`
3. Check all the results:
   - AUTH USER CHECK: Should show confirmed user
   - PROFILE CHECK: Should show admin profile
   - MISMATCH CHECK: IDs should match

### Step 4: Manual Testing

1. Try logging in with a different password to see if error changes
2. Try creating a new user via dashboard
3. Test with that new user

## 🚨 **Common Issues & Solutions**

| Issue               | Symptom                     | Solution                                         |
| ------------------- | --------------------------- | ------------------------------------------------ |
| User doesn't exist  | "Invalid login credentials" | Create user in dashboard                         |
| Email not confirmed | "Invalid login credentials" | Confirm email in dashboard                       |
| Wrong password      | "Invalid login credentials" | Reset password in dashboard                      |
| Profile missing     | Auth works, app fails       | Create profile record                            |
| RLS blocking access | Profile fetch fails         | Check RLS policies                               |
| ID mismatch         | Profile not found           | Ensure IDs match between auth.users and profiles |

## 🎯 **Quick Fix Checklist**

1. **Delete existing user** (if any) from Supabase Dashboard
2. **Create new user** with confirmed email
3. **Copy the User ID** from the dashboard
4. **Update profile** with correct User ID
5. **Test login** with exact credentials
6. **Check debug output** for specific errors

## 🔧 **If Still Not Working**

1. **Share debug output** from the Authentication Flow Debug
2. **Check browser console** for JavaScript errors
3. **Verify Supabase project** is active and not paused
4. **Try different browser** or incognito mode
5. **Check network tab** for failed requests

## 📞 **Need Help?**

Run these and share the results:

1. Authentication Flow Debug output
2. `DIAGNOSE_USER.sql` results
3. Screenshot of Supabase Dashboard → Authentication → Users
4. Any browser console errors

The most common issue is that the user doesn't exist in the auth system or the email isn't confirmed. Start with creating a fresh user in the Supabase Dashboard!
