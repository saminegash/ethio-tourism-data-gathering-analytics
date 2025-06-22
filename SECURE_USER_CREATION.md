# Secure User Creation System

This document explains how the user creation system is designed to ensure that users can **only** be created through the admin dashboard with proper authentication and authorization.

## Security Architecture

### 1. **Service Role Protection**

- The `SUPABASE_SERVICE_ROLE_KEY` is only used server-side in API routes
- Never exposed to the client-side code
- Required for all administrative operations

### 2. **API Route Architecture**

All user management operations go through secure API routes:

```
/api/admin/users                    # POST (create), GET (list)
/api/admin/users/[id]              # PATCH (update role), DELETE (delete)
/api/admin/users/[id]/reset-password # POST (reset password)
```

### 3. **Multi-Layer Security**

#### Layer 1: Authentication Check

- Verifies the user is signed in via Supabase Auth
- Uses server-side cookie verification
- Rejects unauthenticated requests with 401

#### Layer 2: Role Authorization

- Checks the authenticated user's role from the profiles table
- **User Creation**: Admin or Super Agent required
- **User Deletion**: Admin only
- **Role Updates**: Admin or Super Agent
- **Password Reset**: Admin or Super Agent

#### Layer 3: Input Validation

- Email format validation
- Role validation (admin, super_agent, agent, user)
- Required field validation
- Prevents self-deletion for admins

#### Layer 4: Database Security

- Uses Row Level Security (RLS) policies
- Service role bypasses RLS for admin operations
- Profile creation is atomic with auth user creation

## User Creation Flow

### 1. **Admin Dashboard Access**

```
User logs in → Middleware checks role → Dashboard access granted → User Management tab
```

### 2. **Create User Process**

```
Admin fills form → Submit to /api/admin/users → Server validation → Create auth user → Create profile → Return success
```

### 3. **Security Validations**

```
Check admin auth → Verify admin role → Validate input → Create user → Handle errors → Cleanup on failure
```

## Key Security Features

### ✅ **Server-Side Only Operations**

- All user creation happens server-side using service role
- No client-side access to administrative functions
- Service role key never exposed to browsers

### ✅ **Role-Based Access Control**

- Different permission levels for different roles
- Admin: Full user management (create, update, delete, reset)
- Super Agent: User management except deletion
- Agent/User: No user management access

### ✅ **Audit Trail**

- User metadata tracks who created each user
- `created_by` field stores the admin's user ID
- `created_via` field marks source as "admin_dashboard"

### ✅ **Error Handling & Cleanup**

- Failed profile creation triggers auth user cleanup
- Atomic operations prevent orphaned records
- Detailed error messages for debugging

### ✅ **Self-Protection**

- Admins cannot delete their own accounts
- Prevents accidental lockouts
- Role validation prevents privilege escalation

## Environment Setup

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # SERVER-SIDE ONLY
```

### Database Configuration

```sql
-- Profiles table with RLS
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Usage Examples

### Create a New User (Admin Dashboard)

1. Sign in as admin/super_agent
2. Go to `/dashboard`
3. Click "User Management" tab
4. Click "Create New User"
5. Fill form and submit

### API Request Example

```typescript
// This happens automatically when using the dashboard
POST /api/admin/users
{
  "email": "user@example.com",
  "full_name": "New User",
  "role": "agent",
  "password": "custom_password" // optional, defaults to TempPassword123!
}
```

### Response Example

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "profile": {
      "id": "uuid",
      "role": "agent",
      "full_name": "New User"
    }
  },
  "message": "User created successfully"
}
```

## Security Considerations

### ⚠️ **Never Do This**

- Don't expose service role key to client-side
- Don't allow direct database access for user creation
- Don't skip role validation
- Don't create users without profiles

### ✅ **Best Practices**

- Always use API routes for user management
- Validate all inputs server-side
- Log administrative actions
- Use default passwords and force password changes
- Implement proper error handling

## Troubleshooting

### Common Issues

**1. "Unauthorized" Error**

- Check if user is signed in
- Verify session cookies are present
- Ensure user has correct role

**2. "Service Role Key" Error**

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Ensure it's the service role key, not anon key
- Check server-side environment variable access

**3. "Profile Creation Failed"**

- Check database permissions
- Verify profiles table exists
- Ensure RLS policies are correct

**4. "Email Already Exists"**

- User with that email already exists
- Check existing users in auth.users table
- Use different email address

## Testing

### Manual Testing Steps

1. Create admin user manually in Supabase dashboard
2. Set their role to 'admin' in profiles table
3. Sign in through `/login`
4. Navigate to `/dashboard`
5. Test user creation through User Management tab

### Verification

- Check auth.users table for new user
- Check profiles table for corresponding profile
- Verify role assignment is correct
- Test new user can sign in with default password

## Migration from Direct Client Access

If you previously had direct client access to user creation:

### ❌ **Old Way (Insecure)**

```typescript
// DON'T DO THIS - Direct client access to service role
const supabaseAdmin = createClient(url, serviceRoleKey);
await supabaseAdmin.auth.admin.createUser(userData);
```

### ✅ **New Way (Secure)**

```typescript
// USE THIS - API route with server-side validation
const response = await fetch("/api/admin/users", {
  method: "POST",
  body: JSON.stringify(userData),
});
```

This ensures that user creation can **only** happen through the admin dashboard with proper authentication and authorization checks.
