import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
}

if (!supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
}

// Browser client for client-side operations with proper SSR support
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Admin client for service role operations (user management)
// Only create this if the service role key is available
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Helper function to get admin client with error handling
export function getSupabaseAdmin() {
  if (!supabaseServiceRoleKey) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY is not set");
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations are not available. " +
        "Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file. " +
        "You can find this key in your Supabase Dashboard -> Settings -> API -> service_role (secret)"
    );
  }

  if (!supabaseAdmin) {
    console.error("❌ Failed to create Supabase admin client");
    throw new Error("Failed to create Supabase admin client");
  }

  return supabaseAdmin;
}

// Helper function to validate service role key format
export function validateServiceRoleKey(): boolean {
  if (!supabaseServiceRoleKey) {
    return false;
  }

  // Basic validation - service role keys typically start with 'eyJ'
  return (
    supabaseServiceRoleKey.length > 50 &&
    supabaseServiceRoleKey.startsWith("eyJ")
  );
}

// Debug function to check configuration (only in development)
export function debugSupabaseConfig() {
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Supabase Configuration Debug:");
    console.log(
      "✅ NEXT_PUBLIC_SUPABASE_URL:",
      supabaseUrl ? "Set" : "❌ Missing"
    );
    console.log(
      "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      supabaseAnonKey ? "Set" : "❌ Missing"
    );
    console.log(
      "✅ SUPABASE_SERVICE_ROLE_KEY:",
      supabaseServiceRoleKey ? "Set" : "❌ Missing"
    );

    if (supabaseServiceRoleKey) {
      console.log(
        "🔑 Service Role Key Format:",
        validateServiceRoleKey() ? "Valid" : "⚠️ Invalid format"
      );
    }
  }
}
