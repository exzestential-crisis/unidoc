// app/api/medical-specialties/route.ts
import { NextResponse } from "next/server";
import { MedicalSpecialtiesResponseSchema } from "@/lib/schemas/medical-specialty";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("medical_specialties")
    .select("*");

  if (error) {
    console.error("Error fetching specialties:", error);
    return NextResponse.json(
      { error: "Failed to fetch medical specialties." },
      { status: 500 }
    );
  }

  // Validate using Zod
  const validated = MedicalSpecialtiesResponseSchema.safeParse(data);

  if (!validated.success) {
    console.error("Zod validation error:", validated.error);
    return NextResponse.json(
      { error: "Invalid data format." },
      { status: 500 }
    );
  }

  return NextResponse.json(validated.data);
}
