# Authentication & Role-Based Access Control (RBAC) Guide

This guide explains how to use the role-based authentication system implemented with Redux and Supabase.

## Features

- **Role-based access control** with 4 roles: `admin`, `super_agent`, `agent`, `user`
- **Redux state management** for authentication
- **Middleware protection** for routes
- **Component-level access control**
- **Real-time auth state synchronization**

## Setup

### 1. Environment Variables

Ensure you have the following environment variables in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema

Create a `profiles` table in Supabase:

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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

## Role Hierarchy & Permissions

### Roles

- **admin**: Full system access including system administration and audit logs
- **super_agent**: Can manage users, export data, and access revenue analytics
- **agent**: Can manage data sources and tourism sites
- **user**: Basic access to analytics and reports

### Route Permissions

```typescript
const roleBasedPaths = {
  admin: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/users",
    "/settings",
    "/tourism-sites",
    "/visitor-analytics",
    "/revenue-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
    "/export",
    "/system-admin",
    "/audit-logs",
  ],
  super_agent: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/users",
    "/settings",
    "/tourism-sites",
    "/visitor-analytics",
    "/revenue-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
    "/export",
  ],
  agent: [
    "/dashboard",
    "/analytics",
    "/reports",
    "/data-management",
    "/settings",
    "/tourism-sites",
    "/visitor-analytics",
    "/accommodation",
    "/transport",
    "/surveys",
  ],
  user: ["/dashboard", "/analytics", "/reports", "/settings"],
};
```

## Usage

### 1. Using Redux Hooks

```typescript
import { useAppSelector, useAppDispatch } from "../lib/store/hooks";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectUser,
} from "../lib/store/selectors/authSelectors";

function MyComponent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);
  const user = useAppSelector(selectUser);

  // Your component logic
}
```

### 2. Role-based Component Protection

```typescript
import { RoleGuard, AdminOnly, SuperAgentOnly } from '../components/auth/RoleGuard';

// General role guard
<RoleGuard roles={['admin', 'super_agent']} fallback={<div>Access denied</div>}>
  <RevenueAnalytics />
</RoleGuard>

// Admin-only content
<AdminOnly fallback={<div>Admin access required</div>}>
  <SystemAdminPanel />
</AdminOnly>

// Super agent and above
<SuperAgentOnly>
  <UserManagement />
</SuperAgentOnly>

// Path-based protection
<RoleGuard path="/system-admin" fallback={<div>Insufficient permissions</div>}>
  <SystemAdminFeature />
</RoleGuard>
```

### 3. Authentication Actions

```typescript
import { useAppDispatch } from "../lib/store/hooks";
import { signIn, signOut, signUp } from "../lib/store/slices/authSlice";

function AuthComponent() {
  const dispatch = useAppDispatch();

  const handleSignIn = async () => {
    await dispatch(
      signIn({
        email: "user@example.com",
        password: "password",
      })
    );
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
  };

  const handleSignUp = async () => {
    await dispatch(
      signUp({
        email: "user@example.com",
        password: "password",
        fullName: "John Doe",
      })
    );
  };
}
```

### 4. Selectors

```typescript
import { useAppSelector } from "../lib/store/hooks";
import {
  selectIsAuthenticated,
  selectUserRole,
  selectUser,
  selectProfile,
  selectCanAccessPath,
  selectIsAdmin,
  selectCanManageUsers,
  selectCanExportData,
  selectCanViewRevenueAnalytics,
  selectCanManageTourismSites,
} from "../lib/store/selectors/authSelectors";

function MyComponent() {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const canAccessSystemAdmin = useAppSelector((state) =>
    selectCanAccessPath(state, "/system-admin")
  );
  const isAdmin = useAppSelector(selectIsAdmin);
  const canManageUsers = useAppSelector(selectCanManageUsers);
  const canExportData = useAppSelector(selectCanExportData);
  const canViewRevenue = useAppSelector(selectCanViewRevenueAnalytics);
  const canManageSites = useAppSelector(selectCanManageTourismSites);
}
```

## Tourism-Specific Features

### Route Descriptions

- **`/dashboard`**: Main analytics dashboard
- **`/analytics`**: General tourism analytics and insights
- **`/reports`**: Tourism reports and data visualization
- **`/data-management`**: Upload and manage tourism data
- **`/tourism-sites`**: Manage tourism sites and attractions
- **`/visitor-analytics`**: Visitor behavior and demographics
- **`/revenue-analytics`**: Tourism revenue tracking (admin/super_agent only)
- **`/accommodation`**: Hotel and accommodation data
- **`/transport`**: Transportation analytics
- **`/surveys`**: Tourist satisfaction surveys
- **`/export`**: Data export functionality (admin/super_agent only)
- **`/system-admin`**: System administration (admin only)
- **`/audit-logs`**: System audit logs (admin only)

### Permission Helpers

```typescript
// Check if user can export data
const canExport = useAppSelector(selectCanExportData);

// Check if user can manage tourism sites
const canManageSites = useAppSelector(selectCanManageTourismSites);

// Check if user can view revenue analytics
const canViewRevenue = useAppSelector(selectCanViewRevenueAnalytics);
```

## Middleware Protection

The middleware automatically:

- Redirects unauthenticated users to `/login`
- Checks role-based route permissions
- Prevents access loops
- Handles locale routing

## File Structure

```
├── middleware.ts                           # Route protection middleware
├── lib/
│   ├── supabase.ts                        # Supabase client
│   └── store/
│       ├── store.ts                       # Redux store configuration
│       ├── hooks.ts                       # Typed Redux hooks
│       ├── slices/
│       │   └── authSlice.ts              # Authentication slice
│       └── selectors/
│           └── authSelectors.ts          # Authentication selectors
└── components/
    ├── providers/
    │   ├── ReduxProvider.tsx             # Redux store provider
    │   └── AuthProvider.tsx              # Auth state synchronization
    └── auth/
        ├── RoleGuard.tsx                 # Role-based component protection
        ├── LoginForm.tsx                 # Login form component
        └── UserProfile.tsx               # User profile display
```

## Best Practices

1. **Always use typed hooks**: Use `useAppSelector` and `useAppDispatch` instead of the raw hooks
2. **Protect sensitive routes**: Use middleware + component guards for complete protection
3. **Handle loading states**: Check `selectAuthLoading` for loading states
4. **Error handling**: Use `selectAuthError` and `clearError` action
5. **Real-time updates**: The AuthProvider automatically syncs auth state changes

## Example Implementation

```typescript
// Protected Tourism Dashboard Component
"use client";

import { RoleGuard } from "../components/auth/RoleGuard";
import { useAppSelector } from "../lib/store/hooks";
import {
  selectUserRole,
  selectUser,
  selectCanExportData,
  selectCanViewRevenueAnalytics,
} from "../lib/store/selectors/authSelectors";

export default function TourismDashboard() {
  const userRole = useAppSelector(selectUserRole);
  const user = useAppSelector(selectUser);
  const canExport = useAppSelector(selectCanExportData);
  const canViewRevenue = useAppSelector(selectCanViewRevenueAnalytics);

  return (
    <div>
      <h1>Welcome to Ethiopia Tourism Analytics, {user?.email}!</h1>
      <p>Your role: {userRole}</p>

      <RoleGuard roles={["admin"]}>
        <SystemAdminPanel />
      </RoleGuard>

      <RoleGuard roles={["admin", "super_agent"]}>
        <UserManagement />
        {canViewRevenue && <RevenueAnalytics />}
      </RoleGuard>

      <RoleGuard roles={["admin", "super_agent", "agent"]}>
        <TourismSiteManagement />
        <DataManagement />
      </RoleGuard>

      {canExport && <ExportButton />}
    </div>
  );
}
```

## Troubleshooting

1. **Authentication not working**: Check environment variables and Supabase configuration
2. **Role not updating**: Ensure profiles table has correct RLS policies
3. **Middleware redirects**: Check `roleBasedPaths` configuration in middleware
4. **State not syncing**: Verify AuthProvider is properly wrapped in layout
