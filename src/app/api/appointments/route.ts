import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";
import { z } from "zod";

// Zod schema for appointment response validation
const AppointmentSchema = z.object({
  id: z.string().uuid(),
  patient_id: z.string().uuid().nullable(),
  doctor_id: z.string().uuid().nullable(),
  hospital_id: z.string().uuid().nullable(),
  appointment_date: z.string(), // date comes as string from Supabase
  appointment_time: z.string(), // time comes as string from Supabase
  duration_minutes: z.number().nullable(),
  status: z.string().nullable(),
  appointment_type: z.string().nullable(),
  completed_at: z.string().nullable(),
  cancelled_at: z.string().nullable(),
  slot_id: z.string().uuid(),
  is_priority: z.boolean().nullable(),
  priority_fee_paid: z.number().nullable(),
  consultation_fee: z.number().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  confirmed_at: z.string().nullable(),
  symptoms: z.string().nullable(),
  notes: z.string().nullable(),
  cancellation_reason: z.string().nullable(),
});

const AppointmentsResponseSchema = z.array(AppointmentSchema);

// Query parameters schema for filtering/pagination
const QueryParamsSchema = z.object({
  status: z.string().optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  offset: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  date_from: z.string().optional(), // ISO date string
  date_to: z.string().optional(), // ISO date string
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get patient profile for the authenticated user
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

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = QueryParamsSchema.parse({
      status: searchParams.get("status") || undefined,
      limit: searchParams.get("limit") || undefined,
      offset: searchParams.get("offset") || undefined,
      date_from: searchParams.get("date_from") || undefined,
      date_to: searchParams.get("date_to") || undefined,
    });

    // Build the query
    let query = supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", patientProfile.id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });

    // Apply filters
    if (queryParams.status) {
      query = query.eq("status", queryParams.status);
    }

    if (queryParams.date_from) {
      query = query.gte("appointment_date", queryParams.date_from);
    }

    if (queryParams.date_to) {
      query = query.lte("appointment_date", queryParams.date_to);
    }

    // Apply pagination
    if (queryParams.limit) {
      query = query.limit(queryParams.limit);
    }

    if (queryParams.offset) {
      query = query.range(
        queryParams.offset,
        queryParams.offset + (queryParams.limit || 50) - 1
      );
    }

    // Execute the query
    const { data: appointments, error: appointmentsError } = await query;

    if (appointmentsError) {
      console.error("Error fetching appointments:", appointmentsError);
      return NextResponse.json(
        {
          error: "Failed to fetch appointments",
          details: appointmentsError.message,
          code: appointmentsError.code,
          hint: appointmentsError.hint,
          patientId: patientProfile.id,
        },
        { status: 500 }
      );
    }

    // DEBUG: Let's also check if there are ANY appointments in the table
    const { data: allAppointments, error: debugError } = await supabase
      .from("appointments")
      .select("id, patient_id")
      .limit(5);

    // DEBUG: Let's also check what patient IDs exist
    const { data: patientIds, error: patientError } = await supabase
      .from("appointments")
      .select("patient_id")
      .not("patient_id", "is", null)
      .limit(10);

    // DEBUG: Check total count in appointments table
    const { count, error: countError } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true });

    // DEBUG: Let's also check if you might have a singular table name
    const { data: singularCheck, error: singularError } = await supabase
      .from("appointment")
      .select("id, patient_id")
      .limit(3);

    // Validate the response data
    const validatedAppointments = AppointmentsResponseSchema.parse(
      appointments || []
    );

    return NextResponse.json({
      appointments: validatedAppointments,
      total: validatedAppointments.length,
      user_id: user.id,
      patient_id: patientProfile.id,
      // DEBUG INFO - remove these after testing
      debug: {
        searchingFor: patientProfile.id,
        appointmentsTableCount: count,
        allAppointmentsSample: allAppointments || [],
        existingPatientIds: patientIds || [],
        singularTableCheck: singularCheck || [],
        errors: {
          queryError: appointmentsError,
          debugError: debugError,
          countError: countError,
          singularError: singularError?.message || null,
        },
      },
    });
  } catch (error) {
    console.error("Appointments API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
