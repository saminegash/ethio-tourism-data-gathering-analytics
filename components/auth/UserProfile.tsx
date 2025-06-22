"use client";

import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { signOut } from "../../lib/store/slices/authSlice";
import {
  selectUser,
  selectProfile,
  selectUserRole,
  selectIsAuthenticated,
  selectAuthLoading,
} from "../../lib/store/selectors/authSelectors";

export function UserProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const profile = useAppSelector(selectProfile);
  const userRole = useAppSelector(selectUserRole);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

  const handleSignOut = () => {
    dispatch(signOut());
  };

  if (!isAuthenticated) {
    return null;
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
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          {profile?.full_name
            ? profile.full_name.charAt(0).toUpperCase()
            : user?.email?.charAt(0).toUpperCase() || "?"}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {profile?.full_name || "User"}
          </h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            userRole
          )}`}
        >
          {getRoleLabel(userRole)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-6">
        <p>
          <strong>User ID:</strong> {user?.id}
        </p>
        {profile?.created_at && (
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(profile.created_at).toLocaleDateString()}
          </p>
        )}
      </div>

      <button
        onClick={handleSignOut}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
