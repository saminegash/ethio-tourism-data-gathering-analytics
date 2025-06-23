import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../../lib/supabase";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Default password for reset
const DEFAULT_PASSWORD = "TempPassword123!";

// POST - Reset user password
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: userId } = params;

    // Check if service role is available
    let supabaseAdmin;
    try {
      supabaseAdmin = getSupabaseAdmin();
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the authenticated user from the request
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Check if the current user has admin role
    const { data: currentUserProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !currentUserProfile) {
      return NextResponse.json(
        { error: "Unable to verify user permissions" },
        { status: 403 }
      );
    }

    if (currentUserProfile.role !== "admin") {
      return NextResponse.json(
        {
          error: "Insufficient permissions - Admin role required",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const { password } = await request.json();

    // Reset the user password
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        password: password || DEFAULT_PASSWORD,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: `Failed to reset password: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Password reset successfully",
      defaultPassword: password ? undefined : DEFAULT_PASSWORD,
    });
  } catch (error: any) {
    console.error("Error in password reset API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
