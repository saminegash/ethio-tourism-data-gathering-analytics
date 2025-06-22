import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  if (!supabaseAdmin) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations are not available. " +
        "Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file."
    );
  }
  return supabaseAdmin;
}
