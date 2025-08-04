import { NextResponse } from "next/server";
import { z } from "zod";

export function createErrorResponse(
  error: string,
  status: number,
  details?: any
) {
  return NextResponse.json({ error, ...(details && { details }) }, { status });
}

export function createSuccessResponse(data: any, debug?: any) {
  return NextResponse.json({
    ...data,
    ...(debug && { debug }),
  });
}

export function handleApiError(error: unknown) {
  console.error("API error:", error);

  if (error instanceof z.ZodError) {
    return createErrorResponse("Invalid parameters", 400, error.issues);
  }

  if (error instanceof Error) {
    return createErrorResponse("Internal server error", 500, error.message);
  }

  return createErrorResponse("Internal server error", 500, String(error));
}
