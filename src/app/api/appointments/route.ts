// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";
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
  console.error("🚀 APPOINTMENTS POST STARTED");
  console.error("⏰ Timestamp:", new Date().toISOString());

  try {
    console.error("📝 Inside try block");

    // Use regular client for auth, admin client for database operations
    console.error("🔧 About to create supabase client");
    const supabase = await createServerSupabaseClient();
    console.error("✅ Supabase client created successfully");

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
    console.error("📋 About to parse request body");
    const body = await request.json();
    console.error("✅ Request body parsed:", JSON.stringify(body, null, 2));

    console.error("🔍 About to validate with Zod schema");
    const validatedData = appointmentSchema.parse(body);
    console.error(
      "✅ Zod validation passed:",
      JSON.stringify(validatedData, null, 2)
    );

    // TEMPORARY: Use hardcoded patient profile for testing
    // Replace 'test-patient-profile-id' with an actual ID from your DB
    const patientProfile = { id: "f267d0b0-92af-474d-92ab-83bad3c10f64" };
    console.error("👤 Using patient profile:", patientProfile);

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
    const supabaseTransaction = supabaseAdmin; // Use admin client for DB operations

    // Get the selected slot and verify it's available
    console.error("🎯 About to query appointment_slots table");
    console.error("🔍 Looking for slot_id:", validatedData.slot_id);

    const { data: slot, error: slotError } = await supabaseTransaction
      .from("appointment_slots")
      .select("*")
      .eq("id", validatedData.slot_id)
      .eq("is_booked", false)
      .eq("is_blocked", false)
      .single();

    console.error("📊 Slot query result:");
    console.error("  - Slot data:", slot);
    console.error("  - Slot error:", slotError);

    if (slotError || !slot) {
      console.error("❌ Slot not found or error occurred");
      return NextResponse.json(
        {
          error: "Slot not available or already booked",
          debug: { slotError, slot },
        },
        { status: 400 }
      );
    }

    // Debug: Log the values before insertion
    console.error("🏗️ About to create appointment data:");
    console.error("  - slot_id:", validatedData.slot_id);
    console.error("  - slot data:", JSON.stringify(slot, null, 2));
    console.error("  - patient_id:", patientProfile.id);

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

    console.error("📋 Full appointment data to insert:");
    console.error(JSON.stringify(appointmentData, null, 2));

    // Create the appointment using slot details (including slot_id reference)
    console.error("💾 About to insert into appointments table");
    const { data: appointment, error: appointmentError } =
      await supabaseTransaction
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single();

    console.error("📊 Appointment insert result:");
    console.error("  - Appointment data:", appointment);
    console.error("  - Appointment error:", appointmentError);

    if (appointmentError) {
      console.error("❌ Failed to create appointment:", appointmentError);
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
    console.error("🔄 About to update slot as booked");
    const { error: updateSlotError } = await supabaseTransaction
      .from("appointment_slots")
      .update({
        is_booked: true,
        appointment_id: appointment.id,
        booked_at: new Date().toISOString(),
      })
      .eq("id", validatedData.slot_id);

    if (updateSlotError) {
      console.error("❌ Failed to update slot, rolling back appointment");
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

    console.error("🎉 Appointment created successfully!");
    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("💥 CAUGHT ERROR in appointments route:");
    console.error("Error type:", typeof error);
    console.error("Error instanceof Error:", error instanceof Error);
    console.error("Error instanceof z.ZodError:", error instanceof z.ZodError);
    console.error("Full error:", error);

    if (error instanceof z.ZodError) {
      console.error("🔍 Zod validation failed:", error.issues);
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("❌ Appointment creation error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch appointments with slot details
export async function GET(request: NextRequest) {
  console.error("📖 GET appointments started");

  try {
    const supabase = await createServerSupabaseClient();

    const { data: appointments, error } = await supabaseAdmin.from(
      "appointments"
    ).select(`
        *,
        appointment_slots!slot_id(*)
      `);

    if (error) {
      console.error("❌ Failed to fetch appointments:", error);
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: 500 }
      );
    }

    console.error(
      "✅ Appointments fetched successfully:",
      appointments?.length || 0,
      "records"
    );
    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error("💥 Fetch appointments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
