import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ doctorId: string }> }
) {
  const { doctorId } = await params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("doctor_profiles")
      .select(
        `
        *,
        users (
          first_name,
          last_name,
          gender,
          phone,
          profile_image_url
        ),
        medical_specialties (
          name
        ),
        doctor_hospitals (
          id,
          is_primary,
          hospitals (
            id,
            name,
            address
          )
        )
      `
      )
      .eq("id", doctorId)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch doctor profile", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
