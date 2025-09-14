import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Creates a JSON error response
 */
export function createErrorResponse(
  error: string,
  status: number,
  details?: Record<string, unknown> | string | z.ZodIssue[]
) {
  return NextResponse.json({ error, ...(details && { details }) }, { status });
}

/**
 * Creates a JSON success response
 */
export function createSuccessResponse<T extends Record<string, unknown>>(
  data: T,
  debug?: unknown
) {
  return NextResponse.json({
    ...data,
    ...(typeof debug === "object" && debug !== null ? { debug } : {}),
  });
}

/**
 * Handles errors consistently in API routes
 */
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
