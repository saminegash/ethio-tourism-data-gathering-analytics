"use client";

import { useAppSelector } from "../../lib/store/hooks";
import {
  selectUserRole,
  selectUser,
  selectIsAuthenticated,
  selectCanManageUsers,
} from "../../lib/store/selectors/authSelectors";
import { UserManagement } from "../../components/admin/UserManagement";
import { PermissionsDashboard } from "../../components/dashboard/PermissionsDashboard";
import { AdminOnly, SuperAgentOnly } from "../../components/auth/RoleGuard";
import { useState } from "react";

export default function DashboardPage() {
  const userRole = useAppSelector(selectUserRole);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const canManageUsers = useAppSelector(selectCanManageUsers);
  const [activeTab, setActiveTab] = useState<
    "overview" | "permissions" | "users"
  >("overview");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please sign in</h2>
          <p className="text-gray-600 mt-2">
            You need to be signed in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ethiopia Tourism Analytics Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                  userRole
                )}`}
              >
                {getRoleLabel(userRole)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "permissions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Your Permissions
            </button>
            {canManageUsers && (
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                User Management
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "overview" && (
          <div className="py-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Role
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                    userRole
                  )} mt-2`}
                >
                  {getRoleLabel(userRole)}
                </span>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Status
                </h3>
                <p className="text-green-600 font-medium mt-2">Active</p>
              </div>

              <AdminOnly>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Admin Access
                  </h3>
                  <p className="text-red-600 font-medium mt-2">
                    Full System Access
                  </p>
                </div>
              </AdminOnly>

              <SuperAgentOnly>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Management Access
                  </h3>
                  <p className="text-purple-600 font-medium mt-2">
                    User & Data Management
                  </p>
                </div>
              </SuperAgentOnly>
            </div>

            {/* Welcome Message */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Welcome to Ethiopia Tourism Analytics
              </h2>
              <p className="text-gray-600 mb-4">
                This platform provides comprehensive analytics and insights for
                Ethiopia&apos;s tourism industry. Based on your role as a{" "}
                <strong>{getRoleLabel(userRole)}</strong>, you have access to
                specific features and data management capabilities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What you can do:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View tourism analytics and insights</li>
                    <li>• Generate reports and visualizations</li>
                    <li>• Access your permitted data sources</li>
                    {userRole === "admin" && (
                      <li>• Manage all system users and settings</li>
                    )}
                    {["admin", "super_agent"].includes(userRole) && (
                      <li>• Export data and manage users</li>
                    )}
                    {["admin", "super_agent", "agent"].includes(userRole) && (
                      <li>• Manage tourism sites and data</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Quick Actions:
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("permissions")}
                      className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      View Your Permissions
                    </button>
                    {canManageUsers && (
                      <button
                        onClick={() => setActiveTab("users")}
                        className="block w-full text-left px-3 py-2 text-sm bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                      >
                        Manage Users
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "permissions" && <PermissionsDashboard />}

        {activeTab === "users" && canManageUsers && <UserManagement />}
      </div>
    </div>
  );
}
