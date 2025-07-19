import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../../utils/supabase/server";
import { DoctorProfileSchema } from "@/lib/schemas/doctor-profile";

// GET /api/doctor-profiles/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    const id = params.id;

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
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch doctor profile", details: error.message },
        { status: 500 }
      );
    }

    const validatedProfile = DoctorProfileSchema.parse(data);

    return NextResponse.json({
      data: validatedProfile,
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
