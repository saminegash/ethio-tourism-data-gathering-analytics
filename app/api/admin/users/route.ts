import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Interface for user creation request
interface CreateUserRequest {
  email: string;
  password?: string;
  full_name: string;
  role: "admin" | "super_agent" | "agent" | "user";
}

// Default password for new users
const DEFAULT_PASSWORD = "TempPassword123!";

export async function POST(request: NextRequest) {
  try {
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
    const userData: CreateUserRequest = await request.json();

    // Validate required fields
    if (!userData.email || !userData.full_name || !userData.role) {
      return NextResponse.json(
        { error: "Missing required fields: email, full_name, role" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "super_agent", "agent", "user"].includes(userData.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: admin, super_agent, agent, or user" },
        { status: 400 }
      );
    }

    // Create the auth user using service role
    const { data: authData, error: createAuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password || DEFAULT_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: userData.full_name,
          created_by: user.id, // Track who created this user
          created_via: "admin_dashboard",
        },
      });

    if (createAuthError) {
      return NextResponse.json(
        { error: `Failed to create user: ${createAuthError.message}` },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "User creation failed - no user data returned" },
        { status: 400 }
      );
    }

    // Create the profile
    const { data: profileData, error: profileCreateError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
      })
      .select()
      .single();

    if (profileCreateError) {
      // If profile creation fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        {
          error: `Failed to create user profile: ${profileCreateError.message}`,
        },
        { status: 400 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at,
        },
        profile: profileData,
      },
      message: "User created successfully",
    });
  } catch (error: any) {
    console.error("Error in user creation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET method to list users (admin/super_agent only)
export async function GET(request: NextRequest) {
  try {
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
      error: userAuthError,
    } = await supabase.auth.getUser();

    if (userAuthError || !user) {
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

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 400 }
      );
    }

    // Get auth users
    const { data: authUsers, error: authUsersError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (authUsersError) {
      return NextResponse.json(
        { error: "Failed to fetch auth users" },
        { status: 400 }
      );
    }

    // Combine auth data with profile data
    const usersWithProfiles = authUsers.users.map((authUser: any) => {
      const profile = profiles.find((p: any) => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email || "",
        created_at: authUser.created_at,
        profile: profile
          ? {
              role: profile.role,
              full_name: profile.full_name,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithProfiles,
    });
  } catch (error: any) {
    console.error("Error in user listing API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
