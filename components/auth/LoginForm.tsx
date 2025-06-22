"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { signIn, clearError } from "../../lib/store/slices/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
} from "../../lib/store/selectors/authSelectors";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    await dispatch(signIn({ email, password }));
  };

  const getErrorMessage = (errorMsg: string) => {
    if (errorMsg.includes("Invalid login credentials")) {
      return (
        <div>
          <p className="font-medium">Invalid login credentials</p>
          <p className="text-sm mt-1">
            Please check your email and password. If you don't have an account,
            an admin needs to create one for you.
          </p>
        </div>
      );
    }
    return errorMsg;
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Sign In
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {getErrorMessage(error)}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Helper info for testing */}
      <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          For Testing & Development
        </h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p>
            • If you get "Invalid login credentials", the user doesn't exist
          </p>
          <p>• Admin users need to be created manually first</p>
          <p>
            • Default password for new users:{" "}
            <code className="bg-blue-100 px-1 rounded">TempPassword123!</code>
          </p>
          <p>• Check your Supabase dashboard for existing users</p>
        </div>
      </div>
    </div>
  );
}
