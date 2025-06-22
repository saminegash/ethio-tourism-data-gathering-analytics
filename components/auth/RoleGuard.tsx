"use client";

import { ReactNode } from "react";
import { useAppSelector } from "../../lib/store/hooks";
import {
  selectUserRole,
  selectIsAuthenticated,
  selectCanAccessPath,
} from "../../lib/store/selectors/authSelectors";

interface RoleGuardProps {
  children: ReactNode;
  roles?: ("admin" | "super_agent" | "agent" | "user")[];
  path?: string;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function RoleGuard({
  children,
  roles,
  path,
  fallback = null,
  requireAuth = true,
}: RoleGuardProps) {
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const canAccessPath = useAppSelector((state) =>
    path ? selectCanAccessPath(state, path) : true
  );

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (roles && !roles.includes(userRole as any)) {
    return <>{fallback}</>;
  }

  // Check path-based access
  if (path && !canAccessPath) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard roles={["admin"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function SuperAgentOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard roles={["admin", "super_agent"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AgentOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard roles={["admin", "super_agent", "agent"]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AuthenticatedOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requireAuth={true} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
