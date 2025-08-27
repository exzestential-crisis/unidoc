import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: { doctorId: string } } // <- remove Promise
) {
  const { doctorId } = params;
  const supabase = await createClient();

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(doctorId)) {
    return NextResponse.json(
      { error: "Invalid doctor ID format" },
      { status: 400 }
    );
  }

  try {
    // Fetch doctor profile along with user and specialty
    const { data: doctor, error: doctorError } = await supabase
      .from("doctor_profiles")
      .select(
        `
        *,
        users (
          first_name,
          last_name,
          gender,
          phone,
          profile_image_url
        ),
        medical_specialties (
          id,
          name
        )
      `
      )
      .eq("id", doctorId)
      .maybeSingle(); // <- safer than .single()

    if (doctorError) {
      console.error("Supabase error:", doctorError.message);
      return NextResponse.json(
        {
          error: "Failed to fetch doctor profile",
          details: doctorError.message,
        },
        { status: 500 }
      );
    }

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Fetch services for this doctor's specialty
    const { data: services, error: servicesError } = await supabase
      .from("medical_services")
      .select("id, name, description")
      .eq("specialty_id", doctor.specialization_id)
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
        doctor,
        services: services || [],
      },
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
