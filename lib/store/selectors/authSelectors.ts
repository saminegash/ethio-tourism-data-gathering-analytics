import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Basic selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectProfile = (state: RootState) => state.auth.profile;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) =>
  state.auth.initialized;

// Derived selectors
export const selectUserRole = createSelector(
  [selectProfile],
  (profile) => profile?.role || "user"
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);

export const selectUserFullName = createSelector(
  [selectProfile],
  (profile) => profile?.full_name
);

// Role-based access selectors
export const selectHasRole = createSelector(
  [selectUserRole, (_, role: string) => role],
  (userRole, requiredRole) => userRole === requiredRole
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

export const selectIsSuperAgent = createSelector(
  [selectUserRole],
  (role) => role === "super_agent"
);

export const selectIsAgent = createSelector(
  [selectUserRole],
  (role) => role === "agent"
);

export const selectIsUser = createSelector(
  [selectUserRole],
  (role) => role === "user"
);

// Permission-based selectors
export const selectCanAccessPath = createSelector(
  [selectUserRole, (_, path: string) => path],
  (role, path) => {
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

    const allowedPaths =
      roleBasedPaths[role as keyof typeof roleBasedPaths] || [];
    return allowedPaths.some((allowedPath) => path.startsWith(allowedPath));
  }
);

export const selectCanManageUsers = createSelector([selectUserRole], (role) =>
  ["admin", "super_agent"].includes(role)
);

export const selectCanManageAgents = createSelector([selectUserRole], (role) =>
  ["admin", "super_agent"].includes(role)
);

export const selectCanAccessAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

// Tourism-specific permission selectors
export const selectCanAccessSystemAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

export const selectCanExportData = createSelector([selectUserRole], (role) =>
  ["admin", "super_agent"].includes(role)
);

export const selectCanManageDataSources = createSelector(
  [selectUserRole],
  (role) => ["admin", "super_agent", "agent"].includes(role)
);

export const selectCanViewRevenueAnalytics = createSelector(
  [selectUserRole],
  (role) => ["admin", "super_agent"].includes(role)
);

export const selectCanManageTourismSites = createSelector(
  [selectUserRole],
  (role) => ["admin", "super_agent", "agent"].includes(role)
);
