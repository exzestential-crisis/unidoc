// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "../../../../../utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Create admin client for server-side operations that bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
    // Use regular client for auth, admin client for database operations
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    const validatedData = appointmentSchema.parse(body);

    // Get patient profile ID from user
    const { data: patientProfile, error: profileError } = await supabase
      .from("patient_profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !patientProfile) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    // Start a transaction-like operation
    const supabaseTransaction = supabaseAdmin; // Use admin client for DB operations

    const { data: slot, error: slotError } = await supabaseTransaction
      .from("appointment_slots")
      .select("*")
      .eq("id", validatedData.slot_id)
      .eq("is_booked", false)
      .eq("is_blocked", false)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        {
          error: "Slot not available or already booked",
          debug: { slotError, slot },
        },
        { status: 400 }
      );
    }

    // Create the appointment data object
    const appointmentData = {
      patient_id: patientProfile.id,
      doctor_id: slot.doctor_id, // Get from slot
      hospital_id: slot.hospital_id, // Get from slot
      slot_id: validatedData.slot_id, // Store the slot reference
      appointment_date: slot.appointment_date, // Get from slot
      appointment_time: slot.start_time, // Use slot start time
      duration_minutes: 30, // Default duration or calculate from slot times
      appointment_type: validatedData.appointment_type,
      is_priority: validatedData.is_priority,
      symptoms: validatedData.symptoms,
      notes: validatedData.notes,
      status: "pending",
    };

    // Create the appointment using slot details (including slot_id reference)
    const { data: appointment, error: appointmentError } =
      await supabaseTransaction
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single();

    if (appointmentError) {
      return NextResponse.json(
        {
          error: "Failed to create appointment",
          details: appointmentError.message,
          debug: { appointmentData, appointmentError },
        },
        { status: 500 }
      );
    }

    // Update the slot as booked (bidirectional relationship)
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
        { error: "Failed to book slot", debug: { updateSlotError } },
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

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
