"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export function EnvCheck() {
  const [connectionTest, setConnectionTest] = useState<{
    status: string;
    details: any;
  } | null>(null);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession();

      setConnectionTest({
        status: error ? "error" : "success",
        details: {
          hasSession: !!data.session,
          error: error?.message,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
        },
      });
    } catch (err: any) {
      setConnectionTest({
        status: "error",
        details: {
          error: err.message,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
      });
    }
  };

  const testAuth = async () => {
    try {
      // Test with your known credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@test.com",
        password: "TempPassword123!",
      });

      setConnectionTest({
        status: error ? "auth_error" : "auth_success",
        details: {
          error: error?.message,
          user: data.user
            ? {
                id: data.user.id,
                email: data.user.email,
                confirmed: !!data.user.email_confirmed_at,
              }
            : null,
          session: !!data.session,
        },
      });
    } catch (err: any) {
      setConnectionTest({
        status: "auth_error",
        details: {
          error: err.message,
        },
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Environment & Connection Debug
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Supabase Connection
          </button>

          <button
            onClick={testAuth}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Authentication
          </button>
        </div>

        {/* Environment Variables Check */}
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium mb-2">Environment Variables</h4>
          <div className="text-sm space-y-1">
            <div
              className={`flex justify-between ${
                process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>NEXT_PUBLIC_SUPABASE_URL:</span>
              <span>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing"}
              </span>
            </div>
            <div
              className={`flex justify-between ${
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                  ? "✓ Set"
                  : "✗ Missing"}
              </span>
            </div>
            {process.env.NEXT_PUBLIC_SUPABASE_URL && (
              <div className="text-xs text-gray-600 mt-2">
                URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </div>
            )}
          </div>
        </div>

        {/* Connection Test Results */}
        {connectionTest && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium mb-2">Test Results</h4>
            <div
              className={`text-sm ${
                connectionTest.status === "success" ||
                connectionTest.status === "auth_success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <div className="font-medium">Status: {connectionTest.status}</div>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(connectionTest.details, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
