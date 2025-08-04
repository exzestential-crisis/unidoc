import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  // Validate doctorId
  const doctorIdSchema = z.string().uuid();
  const parseResult = doctorIdSchema.safeParse(params.doctorId);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid doctorId parameter" },
      { status: 400 }
    );
  }

  const doctorId = params.doctorId;

  const supabase = await createServerSupabaseClient();

  const url = new URL(request.url);
  const date = url.searchParams.get("date") || undefined;

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
