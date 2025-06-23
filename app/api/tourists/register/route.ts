import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// External API integration functions (mock implementations)
async function fetchImmigrationData(passportNumber: string) {
  // Mock implementation - replace with actual immigration API
  return {
    full_name: "Tourist From Immigration",
    date_of_birth: "1990-01-01",
    nationality: "US",
    entry_date: new Date().toISOString(),
    visa_status: "valid",
  };
}

async function fetchFaydaData(nationalId: string) {
  // Mock implementation - replace with actual Fayda API
  return {
    full_name: "Tourist From Fayda",
    phone_number: "+251911234567",
    address: "Addis Ababa, Ethiopia",
    verified: true,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      passport_number,
      national_id,
      document_type,
      full_name,
      nationality,
      phone_number,
      email,
      purpose_of_visit = "leisure",
      intended_stay_duration = 1,
      group_size = 1,
      registration_location,
      data_collection_consent = false,
    } = body;

    // Validate required fields
    if (!passport_number && !national_id) {
      return NextResponse.json(
        { error: "Either passport number or national ID is required" },
        { status: 400 }
      );
    }

    if (!full_name || !nationality) {
      return NextResponse.json(
        { error: "Full name and nationality are required" },
        { status: 400 }
      );
    }

    // Check if tourist already exists
    let existingTourist = null;
    if (passport_number) {
      const { data } = await supabase
        .from("tourists")
        .select("*")
        .eq("passport_number", passport_number)
        .eq("is_active", true)
        .single();
      existingTourist = data;
    }

    if (!existingTourist && national_id) {
      const { data } = await supabase
        .from("tourists")
        .select("*")
        .eq("national_id", national_id)
        .eq("is_active", true)
        .single();
      existingTourist = data;
    }

    if (existingTourist) {
      return NextResponse.json(
        {
          error: "Tourist already registered",
          tourist_id: existingTourist.id,
          existing: true,
        },
        { status: 409 }
      );
    }

    // Fetch external data if consented and available
    let immigrationData = null;
    let faydaData = null;

    if (data_collection_consent) {
      try {
        if (passport_number) {
          immigrationData = await fetchImmigrationData(passport_number);
        }
        if (national_id) {
          faydaData = await fetchFaydaData(national_id);
        }
      } catch (error) {
        console.warn("Failed to fetch external data:", error);
        // Continue with registration even if external data fails
      }
    }

    // Merge data with priority: user input > immigration > fayda > defaults
    const mergedData = {
      passport_number,
      national_id,
      document_type,
      full_name:
        full_name || immigrationData?.full_name || faydaData?.full_name,
      date_of_birth: body.date_of_birth || immigrationData?.date_of_birth,
      nationality: nationality || immigrationData?.nationality,
      phone_number: phone_number || faydaData?.phone_number,
      email,
      purpose_of_visit,
      intended_stay_duration,
      group_size,
      registration_source: body.registration_source || "on_site",
      registration_location,
      immigration_data: immigrationData,
      fayda_data: faydaData,
      last_external_sync: new Date().toISOString(),
      data_collection_consent,
      verification_status: "verified", // Auto-verify for now
      expires_at: new Date(
        Date.now() + intended_stay_duration * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    // Insert tourist record
    const { data: tourist, error: insertError } = await supabase
      .from("tourists")
      .insert(mergedData)
      .select()
      .single();

    if (insertError) {
      console.error("Database error:", insertError);
      return NextResponse.json(
        { error: "Failed to register tourist" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tourist: {
        id: tourist.id,
        full_name: tourist.full_name,
        nationality: tourist.nationality,
        registration_time: tourist.created_at,
        expires_at: tourist.expires_at,
        verification_status: tourist.verification_status,
      },
      external_data_fetched: !!(immigrationData || faydaData),
      message: "Tourist registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const passport = searchParams.get("passport");
    const nationalId = searchParams.get("national_id");
    const phone = searchParams.get("phone");

    if (!passport && !nationalId && !phone) {
      return NextResponse.json(
        { error: "At least one search parameter is required" },
        { status: 400 }
      );
    }

    let query = supabase.from("tourists").select("*").eq("is_active", true);

    if (passport) {
      query = query.eq("passport_number", passport);
    } else if (nationalId) {
      query = query.eq("national_id", nationalId);
    } else if (phone) {
      query = query.eq("phone_number", phone);
    }

    const { data: tourists, error } = await query;

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Failed to search tourists" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tourists: tourists || [],
      count: tourists?.length || 0,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
