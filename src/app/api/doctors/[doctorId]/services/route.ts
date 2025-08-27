import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET /api/doctors/[doctorId]/services
export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  try {
    const supabase = await createClient();
    const doctorId = params.doctorId;

    // Validate UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(doctorId)) {
      return NextResponse.json({ error: "Invalid doctor ID" }, { status: 400 });
    }

    // Fetch doctor profile
    const { data: doctor, error: doctorError } = await supabase
      .from("doctor_profiles")
      .select(
        "id, user_id, specialization_id, years_experience, consultation_fee, bio, license_number"
      )
      .eq("id", doctorId)
      .maybeSingle(); // safe if no doctor

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Fetch specialty
    const { data: specialty, error: specialtyError } = await supabase
      .from("medical_specialties")
      .select("id, name, category")
      .eq("id", doctor.specialization_id)
      .eq("is_active", true)
      .maybeSingle();

    if (specialtyError || !specialty) {
      return NextResponse.json(
        { error: "Specialty not found or inactive" },
        { status: 404 }
      );
    }

    // Fetch active services
    const { data: services, error: servicesError } = await supabase
      .from("medical_services")
      .select("id, name, description")
      .eq("specialty_id", specialty.id)
      .eq("is_active", true)
      .order("name");

    if (servicesError) {
      console.error(servicesError);
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        doctor,
        specialty,
        services: services || [],
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
