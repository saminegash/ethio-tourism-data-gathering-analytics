"use client";

import { LoginForm } from "../../components/auth/LoginForm";
import { useAppSelector } from "../../lib/store/hooks";
import { selectIsAuthenticated } from "../../lib/store/selectors/authSelectors";

export default function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // If authenticated, show redirecting state (middleware will handle the redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome back!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Redirecting...
            </p>
            {/* Loading spinner */}
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the Ethiopia Tourism Analytics platform
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
