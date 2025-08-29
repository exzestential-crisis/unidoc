import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

// Optional query: filter slots by date
const querySchema = z.object({
  date: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { doctorId: string } }
) {
  // 1️⃣ Validate doctorId
  const doctorIdSchema = z.string().uuid();
  const parseResult = doctorIdSchema.safeParse(params.doctorId);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid doctorId parameter" },
      { status: 400 }
    );
  }

  const doctorId = await params.doctorId;

  // 2️⃣ Parse query params (optional date)
  const url = new URL(request.url);
  const queryParse = querySchema.safeParse({
    date: url.searchParams.get("date") || undefined,
  });

  if (!queryParse.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }

  const { date } = queryParse.data;

  try {
    const supabase = await createClient();

    // 3️⃣ Check that the doctor exists
    const { data: doctor, error: doctorError } = await supabase
      .from("doctor_profiles")
      .select("id, users(first_name,last_name)")
      .eq("id", doctorId)
      .maybeSingle();

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // 4️⃣ Fetch available slots for this doctor only
    let query = supabase
      .from("appointment_slots")
      .select("*")
      .eq("doctor_id", doctorId)
      .eq("is_booked", false)
      .eq("is_blocked", false);

    if (date) {
      query = query.eq("appointment_date", date);
    }

    const { data: slots, error } = await query;

    if (error) {
      console.error("Supabase error fetching slots:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch appointment slots", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      doctor: {
        id: doctor.id,
        name: `${doctor.users?.[0]?.first_name || ""} ${
          doctor.users?.[0]?.last_name || ""
        }`,
      },
      slots: slots || [],
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
