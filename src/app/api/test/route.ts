// app/api/test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  console.error("🔥 TEST ROUTE HIT!");
  console.log("📝 This should appear in terminal");

  return NextResponse.json({ message: "Test successful" });
}
