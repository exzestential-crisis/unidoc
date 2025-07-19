import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";

// Define query validation
const querySchema = z.object({
  doctorId: z.string().uuid(),
  date: z.string().optional(), // optional date filter
});

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(req.url);

  // Validate query params
  const parseResult = querySchema.safeParse({
    doctorId: searchParams.get("doctorId"),
    date: searchParams.get("date") || undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: parseResult.error.format(),
      },
      { status: 400 }
    );
  }

  const { doctorId, date } = parseResult.data;

  // Build query
  let query = supabase
    .from("appointment_slots")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("is_booked", false)
    .eq("is_blocked", false);

  if (date) {
    query = query.eq("appointment_date", date);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slots: data }, { status: 200 });
}
