"use client";

import { useAppSelector } from "../../lib/store/hooks";
import {
  selectUserRole,
  selectUser,
  selectCanExportData,
  selectCanManageUsers,
  selectCanAccessSystemAdmin,
  selectCanViewRevenueAnalytics,
  selectCanManageTourismSites,
  selectCanManageDataSources,
} from "../../lib/store/selectors/authSelectors";

interface RouteInfo {
  path: string;
  name: string;
  description: string;
  accessible: boolean;
}

export function PermissionsDashboard() {
  const userRole = useAppSelector(selectUserRole);
  const user = useAppSelector(selectUser);
  const canExportData = useAppSelector(selectCanExportData);
  const canManageUsers = useAppSelector(selectCanManageUsers);
  const canAccessSystemAdmin = useAppSelector(selectCanAccessSystemAdmin);
  const canViewRevenueAnalytics = useAppSelector(selectCanViewRevenueAnalytics);
  const canManageTourismSites = useAppSelector(selectCanManageTourismSites);
  const canManageDataSources = useAppSelector(selectCanManageDataSources);

  // Define all possible routes with their accessibility
  const allRoutes: RouteInfo[] = [
    {
      path: "/dashboard",
      name: "Dashboard",
      description: "Main analytics dashboard and overview",
      accessible: true, // Everyone can access dashboard
    },
    {
      path: "/analytics",
      name: "Analytics",
      description: "General tourism analytics and insights",
      accessible: ["admin", "super_agent", "agent", "user"].includes(userRole),
    },
    {
      path: "/reports",
      name: "Reports",
      description: "Tourism reports and data visualization",
      accessible: ["admin", "super_agent", "agent", "user"].includes(userRole),
    },
    {
      path: "/data-management",
      name: "Data Management",
      description: "Upload and manage tourism data",
      accessible: canManageDataSources,
    },
    {
      path: "/users",
      name: "User Management",
      description: "Manage system users and their roles",
      accessible: canManageUsers,
    },
    {
      path: "/tourism-sites",
      name: "Tourism Sites",
      description: "Manage tourism sites and attractions",
      accessible: canManageTourismSites,
    },
    {
      path: "/visitor-analytics",
      name: "Visitor Analytics",
      description: "Visitor behavior and demographics analysis",
      accessible: ["admin", "super_agent", "agent"].includes(userRole),
    },
    {
      path: "/revenue-analytics",
      name: "Revenue Analytics",
      description: "Tourism revenue tracking and analysis",
      accessible: canViewRevenueAnalytics,
    },
    {
      path: "/accommodation",
      name: "Accommodation",
      description: "Hotel and accommodation data management",
      accessible: ["admin", "super_agent", "agent"].includes(userRole),
    },
    {
      path: "/transport",
      name: "Transport",
      description: "Transportation analytics and data",
      accessible: ["admin", "super_agent", "agent"].includes(userRole),
    },
    {
      path: "/surveys",
      name: "Surveys",
      description: "Tourist satisfaction surveys and feedback",
      accessible: ["admin", "super_agent", "agent"].includes(userRole),
    },
    {
      path: "/export",
      name: "Data Export",
      description: "Export tourism data and reports",
      accessible: canExportData,
    },
    {
      path: "/system-admin",
      name: "System Administration",
      description: "System configuration and administration",
      accessible: canAccessSystemAdmin,
    },
    {
      path: "/audit-logs",
      name: "Audit Logs",
      description: "System audit logs and security monitoring",
      accessible: canAccessSystemAdmin,
    },
    {
      path: "/settings",
      name: "Settings",
      description: "User settings and preferences",
      accessible: true, // Everyone can access settings
    },
  ];

  const accessibleRoutes = allRoutes.filter((route) => route.accessible);
  const restrictedRoutes = allRoutes.filter((route) => !route.accessible);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "super_agent":
        return "bg-purple-100 text-purple-800";
      case "agent":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_agent":
        return "Super Agent";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Your Access Permissions
      </h1>

      {/* User Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          User Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <p className="text-lg text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Role
            </label>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                userRole
              )}`}
            >
              {getRoleLabel(userRole)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Accessible Routes
            </label>
            <p className="text-lg text-gray-900">
              {accessibleRoutes.length} of {allRoutes.length}
            </p>
          </div>
        </div>
      </div>

      {/* Accessible Routes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Routes You Can Access ({accessibleRoutes.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleRoutes.map((route) => (
            <div
              key={route.path}
              className="border border-green-200 rounded-lg p-4 bg-green-50"
            >
              <h3 className="font-semibold text-green-900">{route.name}</h3>
              <p className="text-sm text-green-700 mt-1">{route.path}</p>
              <p className="text-xs text-green-600 mt-2">{route.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Restricted Routes */}
      {restrictedRoutes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Restricted Routes ({restrictedRoutes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restrictedRoutes.map((route) => (
              <div
                key={route.path}
                className="border border-red-200 rounded-lg p-4 bg-red-50"
              >
                <h3 className="font-semibold text-red-900">{route.name}</h3>
                <p className="text-sm text-red-700 mt-1">{route.path}</p>
                <p className="text-xs text-red-600 mt-2">{route.description}</p>
                <p className="text-xs text-red-500 mt-2 font-medium">
                  Access Denied
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Permissions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Special Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-lg ${
              canExportData
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } border`}
          >
            <h3
              className={`font-semibold ${
                canExportData ? "text-green-900" : "text-gray-500"
              }`}
            >
              Data Export
            </h3>
            <p
              className={`text-sm ${
                canExportData ? "text-green-600" : "text-gray-400"
              }`}
            >
              {canExportData ? "Allowed" : "Not Allowed"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              canManageUsers
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } border`}
          >
            <h3
              className={`font-semibold ${
                canManageUsers ? "text-green-900" : "text-gray-500"
              }`}
            >
              User Management
            </h3>
            <p
              className={`text-sm ${
                canManageUsers ? "text-green-600" : "text-gray-400"
              }`}
            >
              {canManageUsers ? "Allowed" : "Not Allowed"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              canViewRevenueAnalytics
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } border`}
          >
            <h3
              className={`font-semibold ${
                canViewRevenueAnalytics ? "text-green-900" : "text-gray-500"
              }`}
            >
              Revenue Analytics
            </h3>
            <p
              className={`text-sm ${
                canViewRevenueAnalytics ? "text-green-600" : "text-gray-400"
              }`}
            >
              {canViewRevenueAnalytics ? "Allowed" : "Not Allowed"}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              canAccessSystemAdmin
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            } border`}
          >
            <h3
              className={`font-semibold ${
                canAccessSystemAdmin ? "text-green-900" : "text-gray-500"
              }`}
            >
              System Admin
            </h3>
            <p
              className={`text-sm ${
                canAccessSystemAdmin ? "text-green-600" : "text-gray-400"
              }`}
            >
              {canAccessSystemAdmin ? "Allowed" : "Not Allowed"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
