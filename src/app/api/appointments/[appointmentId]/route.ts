import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const supabase = await createServerSupabaseClient();

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
    .from("patient_profiles") // or your patient table name
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

  // All good, return the appointment
  return NextResponse.json(appointment);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { appointmentId } = await params;
  const supabase = await createServerSupabaseClient();

  // Get logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  // Fetch appointment and verify ownership as before...
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

  if (patient.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse request body
  const body = await request.json();

  const newSlotId = body.slot_id;
  if (!newSlotId) {
    return NextResponse.json({ error: "Missing slot_id" }, { status: 400 });
  }

  // Validate slot exists - make sure we're using the correct table name
  console.log("Querying appointment_slots table for slot:", newSlotId);
  const { data: slot, error: slotError } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("id", newSlotId)
    .single();

  console.log("Slot query result:", {
    slot,
    slotError,
    tableName: "appointment_slots",
  });

  if (slotError || !slot) {
    console.error("Slot lookup failed:", slotError);
    return NextResponse.json(
      { error: "Invalid or unavailable slot", details: slotError?.message },
      { status: 400 }
    );
  }

  // Update appointment slot_id, and optionally appointment_date/time from slot info
  const updates = {
    slot_id: newSlotId,
    appointment_date: slot.appointment_date,
    appointment_time: slot.start_time,
  };

  console.log("Updating appointment with:", updates);

  // Option 1: Update and return the updated data
  const { data: updatedAppointment, error: updateError } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId)
    .select("*")
    .single();

  // Alternative approach if the above still fails:
  // Option 2: Update without returning data, then fetch separately
  /*
  const { error: updateError } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", appointmentId);

  if (updateError) {
    console.error("Update failed:", updateError);
    return NextResponse.json(
      { error: "Failed to update appointment", details: updateError.message },
      { status: 500 }
    );
  }

  // Fetch the updated appointment separately
  const { data: updatedAppointment, error: fetchError } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", appointmentId)
    .single();

  if (fetchError) {
    console.error("Fetch after update failed:", fetchError);
    return NextResponse.json(
      { error: "Update succeeded but failed to fetch updated data", details: fetchError.message },
      { status: 500 }
    );
  }
  */

  console.log("Update result:", { updatedAppointment, updateError });

  if (updateError) {
    console.error("Update failed:", updateError);
    return NextResponse.json(
      { error: "Failed to update appointment", details: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: updatedAppointment, success: true });
}
