import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { z } from "zod";

const schema = z.object({
  slot_id: z.string().uuid(),
  appointment_type: z.enum(["regular", "emergency", "followup"]),
  is_priority: z.boolean(),
});

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slot_id, appointment_type, is_priority } = schema.parse(body);

  const { data: profile, error: profileError } = await supabase
    .from("patient_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile || profileError) {
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 }
    );
  }

  // Select unbooked and unblocked slot
  const { data: slot, error: slotError } = await supabase
    .from("appointment_slots")
    .select("*")
    .eq("id", slot_id)
    .eq("is_booked", false)
    .eq("is_blocked", false)
    .single();

  if (!slot || slotError) {
    return NextResponse.json({ error: "Slot unavailable" }, { status: 400 });
  }

  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      patient_id: profile.id,
      doctor_id: slot.doctor_id,
      hospital_id: slot.hospital_id,
      slot_id,
      appointment_date: slot.appointment_date,
      appointment_time: slot.start_time,
      duration_minutes: 30,
      appointment_type,
      is_priority,
      status: "pending",
    })
    .select()
    .single();

  if (appointmentError) {
    return NextResponse.json(
      {
        error: "Failed to create appointment",
        details: appointmentError.message,
      },
      { status: 500 }
    );
  }

  // Attempt to update the slot
  const { error: updateError } = await supabase
    .from("appointment_slots")
    .update({
      is_booked: true,
      appointment_id: appointment.id,
      booked_at: new Date().toISOString(),
    })
    .eq("id", slot_id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to mark slot as booked", details: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Appointment booked", appointment },
    { status: 201 }
  );
}
