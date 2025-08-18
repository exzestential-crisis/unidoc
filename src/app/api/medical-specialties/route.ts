import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // new client

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("medical_specialties")
      .select("*");

    if (error) {
      console.error("Error fetching specialties:", error);
      return NextResponse.json(
        { error: "Failed to fetch medical specialties.", details: error.message },
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
