import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Filter parameters
    const nationality = searchParams.get("nationality");
    const purposeOfVisit = searchParams.get("purpose_of_visit");
    const verificationStatus = searchParams.get("verification_status");
    const registrationSource = searchParams.get("registration_source");
    const isActive = searchParams.get("is_active");

    // Search parameters
    const search = searchParams.get("search"); // For name, passport, or national ID

    // Sorting parameters
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = searchParams.get("sort_order") || "desc";

    // Date range parameters
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    // Build the query
    let query = supabase.from("tourists").select(
      `
        id,
        passport_number,
        national_id,
        document_type,
        full_name,
        nationality,
        phone_number,
        email,
        purpose_of_visit,
        intended_stay_duration,
        group_size,
        registration_source,
        registration_location,
        verification_status,
        is_active,
        data_collection_consent,
        created_at,
        updated_at,
        expires_at
      `,
      { count: "exact" }
    );

    // Apply filters
    if (nationality) {
      query = query.ilike("nationality", `%${nationality}%`);
    }

    if (purposeOfVisit) {
      query = query.eq("purpose_of_visit", purposeOfVisit);
    }

    if (verificationStatus) {
      query = query.eq("verification_status", verificationStatus);
    }

    if (registrationSource) {
      query = query.eq("registration_source", registrationSource);
    }

    if (isActive !== null) {
      query = query.eq("is_active", isActive === "true");
    }

    // Apply search
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,passport_number.ilike.%${search}%,national_id.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    // Apply date range
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: tourists, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch tourists" },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      success: true,
      data: tourists || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext,
        hasPrev,
      },
      filters: {
        nationality,
        purposeOfVisit,
        verificationStatus,
        registrationSource,
        isActive,
        search,
        dateFrom,
        dateTo,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("Tourist list API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
