import { NextResponse } from "next/server";
import {
  debugSupabaseConfig,
  validateServiceRoleKey,
} from "../../../../lib/supabase";

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Debug endpoint not available in production" },
      { status: 403 }
    );
  }

  try {
    // Run debug configuration
    debugSupabaseConfig();

    // Check each environment variable
    const config = {
      supabase_url: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        value: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? "✅ Present"
          : "❌ Missing",
        sample: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...`
          : "Not set",
      },
      anon_key: {
        set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "✅ Present"
          : "❌ Missing",
        sample: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
          : "Not set",
      },
      service_key: {
        set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        value: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? "✅ Present"
          : "❌ Missing",
        valid_format: validateServiceRoleKey() ? "✅ Valid" : "❌ Invalid",
        sample: process.env.SUPABASE_SERVICE_ROLE_KEY
          ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`
          : "Not set",
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    // Additional checks
    const issues = [];
    if (!config.supabase_url.set)
      issues.push("NEXT_PUBLIC_SUPABASE_URL is missing");
    if (!config.anon_key.set)
      issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing");
    if (!config.service_key.set)
      issues.push("SUPABASE_SERVICE_ROLE_KEY is missing");
    if (config.service_key.set && !validateServiceRoleKey()) {
      issues.push("SUPABASE_SERVICE_ROLE_KEY format appears invalid");
    }

    return NextResponse.json({
      status: issues.length === 0 ? "✅ All Good" : "⚠️ Issues Found",
      config,
      issues: issues.length > 0 ? issues : ["No issues detected"],
      next_steps:
        issues.length > 0
          ? [
              "Check your .env.local file",
              "Ensure all keys are properly copied from Supabase Dashboard",
              "Restart your development server",
              "Verify keys don't have extra spaces or characters",
            ]
          : [
              "Configuration looks good!",
              "Try creating a user through the admin panel",
              "Check server logs for any runtime errors",
            ],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to debug configuration",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
