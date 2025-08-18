import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // new client

// GET /api/medical-specialties/[specialtyId]/services
export async function GET(
  request: Request,
  { params }: { params: { specialtyId: string } }
) {
  try {
    const supabase = await createClient();
    const specialtyId = params.specialtyId;

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(specialtyId)) {
      return NextResponse.json(
        { error: "Invalid specialty ID format" },
        { status: 400 }
      );
    }

    // Verify the specialty exists and is active
    const { data: specialty, error: specialtyError } = await supabase
      .from("medical_specialties")
      .select("id, name, category, is_active")
      .eq("id", specialtyId)
      .eq("is_active", true)
      .single();

    if (specialtyError || !specialty) {
      return NextResponse.json(
        { error: "Medical specialty not found or inactive" },
        { status: 404 }
      );
    }

    // Fetch active services for this specialty
    const { data: services, error: servicesError } = await supabase
      .from("medical_services")
      .select("id, name, description, is_active")
      .eq("specialty_id", specialtyId)
      .eq("is_active", true)
      .order("name");

    if (servicesError) {
      console.error("Supabase error fetching services:", servicesError.message);
      return NextResponse.json(
        { error: "Failed to fetch services", details: servicesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        specialty: {
          id: specialty.id,
          name: specialty.name,
          category: specialty.category,
        },
        services: services || [],
      },
      success: true,
      message: `Found ${services?.length || 0} services for ${specialty.name}`,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
