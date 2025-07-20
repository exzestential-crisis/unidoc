// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";

// Zod schema for appointment booking
const appointmentSchema = z.object({
  slot_id: z.string().uuid(), // Required - users must pick from existing slots
  appointment_type: z
    .enum(["regular", "emergency", "followup"])
    .default("regular"),
  is_priority: z.boolean().default(false),
  symptoms: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // TEMPORARY: Comment out for testing
    /*
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    */

    // Parse request body
    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    // TEMPORARY: Use hardcoded patient profile for testing
    // Replace 'test-patient-profile-id' with an actual ID from your DB
    const patientProfile = { id: "test-patient-profile-id" };

    /*
    // Get patient profile ID from user
    const { data: patientProfile, error: profileError } = await supabase
      .from('patient_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile not found' },
        { status: 404 }
      );
    }
    */

    // Start a transaction-like operation
    const supabaseTransaction = supabase;

    // Get the selected slot and verify it's available
    const { data: slot, error: slotError } = await supabaseTransaction
      .from("appointment_slots")
      .select("*")
      .eq("id", validatedData.slot_id)
      .eq("is_booked", false)
      .eq("is_blocked", false)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: "Slot not available or already booked" },
        { status: 400 }
      );
    }

    // Create the appointment using slot details
    const { data: appointment, error: appointmentError } =
      await supabaseTransaction
        .from("appointments")
        .insert({
          patient_id: patientProfile.id,
          doctor_id: slot.doctor_id, // Get from slot
          hospital_id: slot.hospital_id, // Get from slot
          appointment_date: slot.appointment_date, // Get from slot
          appointment_time: slot.start_time, // Use slot start time
          duration_minutes: 30, // Default duration or calculate from slot times
          appointment_type: validatedData.appointment_type,
          is_priority: validatedData.is_priority,
          symptoms: validatedData.symptoms,
          notes: validatedData.notes,
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

    // Update the slot as booked
    const { error: updateSlotError } = await supabaseTransaction
      .from("appointment_slots")
      .update({
        is_booked: true,
        appointment_id: appointment.id,
        booked_at: new Date().toISOString(),
      })
      .eq("id", validatedData.slot_id);

    if (updateSlotError) {
      // Rollback: delete the appointment if slot update fails
      await supabaseTransaction
        .from("appointments")
        .delete()
        .eq("id", appointment.id);

      return NextResponse.json(
        { error: "Failed to book slot" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
