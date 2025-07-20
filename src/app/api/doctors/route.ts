import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../../../utils/supabase/server";
import { DoctorProfilesResponseSchema } from "../../../lib/schemas/doctor-profile";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filters
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const verified = searchParams.get("verified");
    const accepting_patients = searchParams.get("accepting_patients");
    const specialization_ids = searchParams.getAll("specialization_id");
    const q = searchParams.get("q"); // keyword search
    const min_exp = searchParams.get("min_experience");
    const max_exp = searchParams.get("max_experience");
    const gender = searchParams.get("gender");
    const language = searchParams.get("language");
    const min_rating = searchParams.get("min_rating");

    const supabase = await createServerSupabaseClient();

    // Start query with join to users table
    let query = supabase
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
      .order("created_at", { ascending: false });

    // Apply filters
    if (verified === "true") query = query.eq("is_verified", true);
    if (accepting_patients === "true")
      query = query.eq("is_accepting_patients", true);

    if (specialization_ids.length > 0) {
      query = query.in("specialization_id", specialization_ids);
    }

    if (min_exp) query = query.gte("years_experience", Number(min_exp));
    if (max_exp) query = query.lte("years_experience", Number(max_exp));
    if (min_rating) query = query.gte("rating_average", Number(min_rating));

    if (language) {
      query = query.contains("languages_spoken", [language]);
    }

    // Filter by gender on joined users table
    if (gender) {
      query = query.eq("users.gender", gender);
    }

    // FIXED: Keyword search - robust approach for joined tables
    if (q) {
      // Since searching across joined tables can be tricky,
      // let's use a more explicit approach

      // First get user IDs that match the name search
      const { data: matchingUsers } = await supabase
        .from("users")
        .select("id")
        .or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`);

      const userIds = matchingUsers?.map((user) => user.id) || [];

      // Now search either by user_id (for name matches) or bio (for bio matches)
      if (userIds.length > 0) {
        query = query.or(`user_id.in.(${userIds.join(",")}),bio.ilike.%${q}%`);
      } else {
        // No name matches, search only bio
        query = query.ilike("bio", `%${q}%`);
      }
    }

    // Pagination
    if (limit) {
      query = query.limit(Number(limit));
    }
    if (offset) {
      const offsetNum = Number(offset);
      const limitNum = limit ? Number(limit) : 10;
      query = query.range(offsetNum, offsetNum + limitNum - 1);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch doctor profiles", details: error.message },
        { status: 500 }
      );
    }

    // Validate data with Zod
    const validatedData = DoctorProfilesResponseSchema.parse(data);

    return NextResponse.json({
      data: validatedData,
      count: validatedData.length,
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
