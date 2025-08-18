import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server"; // new client

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

  // Use the new async client
  const supabase = await createClient();

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
