import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // new client

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const supabase = await createClient();

  // Get logged in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Fetch appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single();

  if (appointmentError || !appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  // Fetch patient linked to appointment.patient_id
  const { data: patient, error: patientError } = await supabase
    .from("patient_profiles")
    .select("user_id")
    .eq("id", appointment.patient_id)
    .single();

  if (patientError || !patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  // Verify logged-in user owns this patient
  if (patient.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const supabase = await createClient();

  // Get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Fetch appointment and verify ownership
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single();

  if (appointmentError || !appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  const { data: patient, error: patientError } = await supabase
    .from("patient_profiles")
    .select("user_id")
    .eq("id", appointment.patient_id)
    .single();

  if (patientError || !patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  if (patient.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse request body
  const body = await request.json();
  const newSlotId = body.slot_id;

  if (!newSlotId) {
    return NextResponse.json({ error: "Missing slot_id" }, { status: 400 });
  }

  // Validate slot exists
  const { data: slot, error: slotError } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("id", newSlotId)
    .single();

  if (slotError || !slot) {
    return NextResponse.json(
      { error: "Invalid or unavailable slot", details: slotError?.message },
      { status: 400 }
    );
  }

  // Update appointment
  const updates = {
    slot_id: newSlotId,
    appointment_date: slot.appointment_date,
    appointment_time: slot.start_time,
  };

  const { data: updatedAppointment, error: updateError } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update appointment", details: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: updatedAppointment, success: true });
}
