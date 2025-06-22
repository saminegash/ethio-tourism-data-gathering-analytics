import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../../lib/supabase";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// PATCH - Update user role
export async function PATCH(
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

    // Check if the current user has admin or super_agent role
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

    if (!["admin", "super_agent"].includes(currentUserProfile.role)) {
      return NextResponse.json(
        {
          error:
            "Insufficient permissions - Admin or Super Agent role required",
        },
        { status: 403 }
      );
    }

    // Parse the request body
    const { role } = await request.json();

    // Validate role
    if (!["admin", "super_agent", "agent", "user"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: admin, super_agent, agent, or user" },
        { status: 400 }
      );
    }

    // Update the user role
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to update user role: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "User role updated successfully",
    });
  } catch (error: any) {
    console.error("Error in user role update API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
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

    // Check if the current user has admin role (only admins can delete users)
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
        { error: "Insufficient permissions - Admin role required" },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete the user (this will cascade to profiles due to foreign key)
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json(
        { error: `Failed to delete user: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in user deletion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
