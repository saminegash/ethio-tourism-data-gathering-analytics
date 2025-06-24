"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { signOut } from "../../lib/store/slices/authSlice";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectProfile,
} from "../../lib/store/selectors/authSelectors";
import { ThemeSwitcher } from "../theme-switcher";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);
  const profile = useAppSelector(selectProfile);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    await dispatch(signOut());
    // Redirect to home page after logout
    window.location.href = "/";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-accent-100 text-accent-800";
      case "partner":
        return "bg-secondary-100 text-secondary-800";
      case "api_client":
        return "bg-primary-100 text-primary-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "partner":
        return "Partner";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
            >
              🇪🇹 Ethiopia Tourism
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className="text-gray-900 hover:text-primary-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {isAuthenticated && user?.role === "admin" && (
                  <Link
                    href="/upload"
                    className="text-gray-900 hover:text-primary-600 transition-colors font-medium"
                  >
                    Upload Data
                  </Link>
                )}
                {isAuthenticated &&
                  (userRole === "admin" || userRole === "partner") && (
                    <Link
                      href="/register"
                      className="text-gray-900 hover:text-primary-600 transition-colors font-medium"
                    >
                      Register Tourist
                    </Link>
                  )}
                {isAuthenticated &&
                  (userRole === "admin" || userRole === "partner") && (
                    <Link
                      href="/tourists"
                      className="text-gray-900 hover:text-primary-600 transition-colors font-medium"
                    >
                      View Tourists
                    </Link>
                  )}
                <Link
                  href="/dashboard/arrivals"
                  className="text-foreground hover:text-primary-600 transition-colors font-medium"
                >
                  Arrivals
                </Link>
                <Link
                  href="/dashboard/occupancy"
                  className="text-foreground hover:text-secondary-600 transition-colors font-medium"
                >
                  Occupancy
                </Link>
                <Link
                  href="/dashboard/visits"
                  className="text-foreground hover:text-accent-600 transition-colors font-medium"
                >
                  Visits
                </Link>
                <Link
                  href="/dashboard/insights"
                  className="text-gray-900 hover:text-orange-600 transition-colors font-medium"
                >
                  Insights
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* <ThemeSwitcher /> */}

            {/* Authenticated User Section */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 hover:bg-gray-100 transition-colors"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                    {profile?.full_name ? getInitials(profile.full_name) : "U"}
                  </div>

                  {/* User Info */}
                  <div className="hidden md:block text-left">
                    <p className="text-gray-900 font-medium">
                      {profile?.full_name || "User"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(
                          userRole
                        )}`}
                      >
                        {getRoleLabel(userRole)}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-black border border-gray-200 rounded-xl shadow-lg z-50 text-white">
                    <div className="py-1">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-white">
                          {profile?.full_name || "User"}
                        </p>
                        <p className="text-sm text-gray-200">{user.email}</p>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getRoleColor(
                              userRole
                            )}`}
                          >
                            {getRoleLabel(userRole)}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-100 hover:bg-primary-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-100 hover:bg-primary-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated User Section */
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-primary-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <div className="text-sm text-gray-600">
                  Tourism Analytics Platform
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
