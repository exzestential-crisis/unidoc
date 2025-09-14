import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // your new server client

export async function GET() {
  // Create Supabase client using your async createClient()
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Fetching profile for user ID:", user.id);

  const { data: profile, error } = await supabase
    .from("patient_profiles")
    .select(
      `
    *,
    user:users(*)
  `
    )
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  console.log("Full profile:", JSON.stringify(profile, null, 2));

  return NextResponse.json(profile);
}
