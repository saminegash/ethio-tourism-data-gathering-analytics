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
  (profile) => profile?.role || "viewer"
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
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

export const selectIsViewer = createSelector(
  [selectUserRole],
  (role) => role === "viewer"
);

export const selectIsApiClient = createSelector(
  [selectUserRole],
  (role) => role === "api_client"
);

export const selectIsPartner = createSelector(
  [selectUserRole],
  (role) => role === "partner"
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
      partner: [
        "/dashboard",
        "/analytics",
        "/reports",
        "/data-management",
        "/settings",
        "/tourism-sites",
        "/visitor-analytics",
        "/revenue-analytics",
        "/accommodation",
        "/transport",
        "/surveys",
        "/export",
      ],
      api_client: [
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
      viewer: ["/dashboard", "/analytics", "/reports", "/settings"],
    };

    const allowedPaths =
      roleBasedPaths[role as keyof typeof roleBasedPaths] || [];
    return allowedPaths.some((allowedPath) => path.startsWith(allowedPath));
  }
);

export const selectCanManageUsers = createSelector([selectUserRole], (role) =>
  ["admin"].includes(role)
);

export const selectCanManageAgents = createSelector([selectUserRole], (role) =>
  ["admin", "partner"].includes(role)
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
  ["admin", "partner"].includes(role)
);

export const selectCanManageDataSources = createSelector(
  [selectUserRole],
  (role) => ["admin", "partner", "api_client"].includes(role)
);

export const selectCanViewRevenueAnalytics = createSelector(
  [selectUserRole],
  (role) => ["admin", "partner"].includes(role)
);

export const selectCanManageTourismSites = createSelector(
  [selectUserRole],
  (role) => ["admin", "partner", "api_client"].includes(role)
);
