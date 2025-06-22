"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface DebugStep {
  step: string;
  status: "pending" | "success" | "error";
  details: any;
  timestamp: string;
}

export function AuthFlowDebug() {
  const [debugSteps, setDebugSteps] = useState<DebugStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addStep = (
    step: string,
    status: "pending" | "success" | "error",
    details: any
  ) => {
    setDebugSteps((prev) => [
      ...prev,
      {
        step,
        status,
        details,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const clearSteps = () => {
    setDebugSteps([]);
  };

  const runFullDiagnosis = async () => {
    setIsRunning(true);
    clearSteps();

    try {
      // Step 1: Test basic connection
      addStep("Testing Supabase Connection", "pending", null);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        addStep("Testing Supabase Connection", "success", {
          hasSession: !!data.session,
        });
      } catch (err: any) {
        addStep("Testing Supabase Connection", "error", { error: err.message });
        setIsRunning(false);
        return;
      }

      // Step 2: Check if user exists (this will fail with auth, but we can try)
      addStep("Checking User Existence", "pending", null);
      try {
        // We can't directly query auth.users from client, but we can try to sign in and see what happens
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "admin@test.com",
          password: "wrong-password", // Intentionally wrong to see if user exists
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            addStep("Checking User Existence", "error", {
              error: "User may not exist or password is wrong",
              errorCode: error.message,
            });
          } else {
            addStep("Checking User Existence", "error", {
              error: error.message,
            });
          }
        } else {
          addStep("Checking User Existence", "success", { userExists: true });
        }
      } catch (err: any) {
        addStep("Checking User Existence", "error", { error: err.message });
      }

      // Step 3: Try actual authentication
      addStep("Testing Authentication", "pending", null);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "admin@test.com",
          password: "TempPassword123!",
        });

        if (error) {
          addStep("Testing Authentication", "error", {
            error: error.message,
            errorDetails: error,
          });
        } else {
          addStep("Testing Authentication", "success", {
            userId: data.user?.id,
            email: data.user?.email,
            confirmed: !!data.user?.email_confirmed_at,
            hasSession: !!data.session,
          });

          // Step 4: Try to fetch profile if auth succeeded
          if (data.user) {
            addStep("Fetching User Profile", "pending", null);
            try {
              const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

              if (profileError) {
                addStep("Fetching User Profile", "error", {
                  error: profileError.message,
                  userId: data.user.id,
                });
              } else {
                addStep("Fetching User Profile", "success", profile);
              }
            } catch (err: any) {
              addStep("Fetching User Profile", "error", { error: err.message });
            }

            // Sign out after testing
            await supabase.auth.signOut();
          }
        }
      } catch (err: any) {
        addStep("Testing Authentication", "error", { error: err.message });
      }

      // Step 5: Check profiles table structure
      addStep("Checking Profiles Table", "pending", null);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .limit(1);

        if (error) {
          addStep("Checking Profiles Table", "error", {
            error: error.message,
            hint: "Profiles table may not exist or have RLS issues",
          });
        } else {
          addStep("Checking Profiles Table", "success", {
            tableExists: true,
            sampleData: data,
          });
        }
      } catch (err: any) {
        addStep("Checking Profiles Table", "error", { error: err.message });
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "pending":
        return "⏳";
      default:
        return "❓";
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        Authentication Flow Diagnosis
      </h3>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runFullDiagnosis}
            disabled={isRunning}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isRunning ? "Running Diagnosis..." : "Run Full Diagnosis"}
          </button>

          <button
            onClick={clearSteps}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>

        {debugSteps.length > 0 && (
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium mb-3">Diagnosis Results</h4>
            <div className="space-y-3">
              {debugSteps.map((step, index) => (
                <div key={index} className="border-b pb-2 last:border-b-0">
                  <div
                    className={`flex items-center gap-2 font-medium ${getStatusColor(
                      step.status
                    )}`}
                  >
                    <span>{getStatusIcon(step.status)}</span>
                    <span>{step.step}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {step.details && (
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(step.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What This Tests</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Supabase connection and configuration</li>
            <li>• User existence in auth.users table</li>
            <li>• Authentication with correct credentials</li>
            <li>• Profile table access and structure</li>
            <li>• User profile data retrieval</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
