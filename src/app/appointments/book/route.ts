// app/api/appointments/book/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";
import { z } from "zod";

// Validation schema for booking appointment
const bookAppointmentSchema = z.object({
  slotId: z.string().uuid("Invalid slot ID"),
  symptoms: z
    .string()
    .min(1, "Symptoms are required")
    .max(1000, "Symptoms too long"),
  notes: z.string().max(500, "Notes too long").optional(),
  isPriority: z.boolean().default(false),
  consultationFee: z.number().positive().optional(),
  priorityFee: z.number().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get patient profile
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = bookAppointmentSchema.parse(body);

    // Start a transaction to book the appointment
    const { data: slot, error: slotError } = await supabase
      .from("appointment_slots")
      .select("*")
      .eq("id", validatedData.slotId)
      .eq("is_booked", false)
      .eq("is_blocked", false)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: "Slot not available or not found" },
        { status: 409 }
      );
    }

    // Check if appointment date is in the future
    const appointmentDate = new Date(slot.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return NextResponse.json(
        { error: "Cannot book appointments for past dates" },
        { status: 400 }
      );
    }

    // Create the appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientProfile.id,
        doctor_id: slot.doctor_id,
        hospital_id: slot.hospital_id,
        appointment_date: slot.appointment_date,
        appointment_time: slot.start_time,
        duration_minutes: 60, // Default 1 hour based on slot times
        status: "pending",
        appointment_type: validatedData.isPriority ? "priority" : "regular",
        is_priority: validatedData.isPriority,
        priority_fee_paid: validatedData.priorityFee || null,
        consultation_fee: validatedData.consultationFee || null,
        symptoms: validatedData.symptoms,
        notes: validatedData.notes || null,
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

    // Update the slot to mark as booked
    const { error: updateSlotError } = await supabase
      .from("appointment_slots")
      .update({
        is_booked: true,
        appointment_id: appointment.id,
        booked_at: new Date().toISOString(),
      })
      .eq("id", validatedData.slotId);

    if (updateSlotError) {
      // Rollback appointment creation if slot update fails
      await supabase.from("appointments").delete().eq("id", appointment.id);

      return NextResponse.json(
        {
          error: "Failed to book appointment",
          details: updateSlotError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        status: appointment.status,
        isPriority: appointment.is_priority,
        symptoms: appointment.symptoms,
        notes: appointment.notes,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        },
        { status: 400 }
      );
    }

    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user's appointments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get patient profile
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

    // Fetch appointments with related data
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        `
        *,
        doctor_profiles!inner(
          user_id,
          specialization,
          users!inner(
            first_name,
            last_name
          )
        ),
        hospitals!inner(
          name,
          address
        )
      `
      )
      .eq("patient_id", patientProfile.id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });

    if (appointmentsError) {
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 }
      );
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
