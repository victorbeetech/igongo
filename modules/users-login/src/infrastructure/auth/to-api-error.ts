/**
 * Turns our `AppError` into Better Auth's `APIError`, so errors thrown inside
 * Better Auth hooks and endpoints reach the caller with the right status and
 * our machine-readable code.
 */

import { APIError } from "better-auth/api";
import { AppError } from "@igongo/core";

/** Better Auth's status names for our HTTP statuses. */
const STATUS_NAME: Record<number, "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "TOO_MANY_REQUESTS" | "SERVICE_UNAVAILABLE"> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  429: "TOO_MANY_REQUESTS",
  503: "SERVICE_UNAVAILABLE",
};

/** Runs [work]; an `AppError` becomes an `APIError`, anything else is re-thrown. */
export async function asApiError<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof AppError) throw new APIError(STATUS_NAME[error.status] ?? "BAD_REQUEST", { message: error.message, code: error.code.toUpperCase() });
    throw error;
  }
}
