import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // new client

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

  // Get all appointments for the patient
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patient.id);

  if (appointmentsError) {
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: appointments });
}
