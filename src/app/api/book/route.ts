import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const schema = z.object({
  slot_id: z.string().uuid().nullable(),
  services_id: z.string(), // Can be UUID or "other"
  concern: z.string().min(1, "Concern is required"),
  appointment_type: z
    .enum(["regular", "emergency", "followup"])
    .optional()
    .default("regular"),
  is_priority: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Get logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { slot_id, services_id, concern, appointment_type, is_priority } =
      schema.parse(body);

    // Fetch patient profile
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
      return NextResponse.json(
        {
          error: "Slot unavailable",
          details: slotError?.message,
        },
        { status: 400 }
      );
    }

    // Validate service exists (only if not "other")
    let validatedServiceId = null;
    if (services_id !== "other") {
      const { data: service, error: serviceError } = await supabase
        .from("medical_services")
        .select("id")
        .eq("id", services_id)
        .single();

      if (!service || serviceError) {
        return NextResponse.json(
          {
            error: "Invalid service selected",
            details: serviceError?.message,
          },
          { status: 400 }
        );
      }
      validatedServiceId = service.id;
    }

    // Insert new appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: profile.id,
        doctor_id: slot.doctor_id,
        hospital_id: slot.hospital_id,
        slot_id,
        services_id: validatedServiceId, // Will be null for "other"
        concern: concern.trim(),
        appointment_date: slot.appointment_date,
        appointment_time: slot.start_time,
        duration_minutes: 30,
        appointment_type,
        is_priority,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select(
        `
        id,
        appointment_date,
        appointment_time,
        duration_minutes,
        appointment_type,
        is_priority,
        status,
        concern,
        services_id,
        doctor_id,
        patient_id,
        hospital_id,
        created_at
      `
      )
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
        {
          error: "Failed to mark slot as booked",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // Fetch additional details for response
    const { data: doctorDetails } = await supabase
      .from("doctors")
      .select("name")
      .eq("id", slot.doctor_id)
      .single();

    const { data: serviceDetails } =
      services_id !== "other"
        ? await supabase
            .from("services")
            .select("name")
            .eq("id", services_id)
            .single()
        : { data: { name: "Other" } };

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        data: {
          appointment: {
            ...appointment,
            doctor_name: doctorDetails?.name,
            service_name: serviceDetails?.name || "Other",
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: error.issues
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
