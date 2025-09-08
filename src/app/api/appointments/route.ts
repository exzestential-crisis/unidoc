import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  // Create Supabase client
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Get patient profile for logged-in user
  const { data: patient, error: patientError } = await supabase
    .from("patient_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (patientError || !patient) {
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 }
    );
  }

  // Get all appointments for the patient with doctor information
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
      *,
      doctor_profiles (
        id,
        specialization_id,
        years_experience,
        consultation_fee,
        rating_average,
        total_reviews,
        users (
          first_name,
          last_name,
          profile_image_url
        ),
        medical_specialties (
          id,
          name
        ),
        doctor_hospitals (
          id,
          is_primary,
          hospitals (
            id,
            name,
            address
          )
        )
      )
    `
    )
    .eq("patient_id", patient.id)
    .order("appointment_date", { ascending: false });

  if (appointmentsError) {
    console.error("Supabase error:", appointmentsError.message);
    return NextResponse.json(
      {
        error: "Failed to fetch appointments",
        details: appointmentsError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: appointments || [] });
}
