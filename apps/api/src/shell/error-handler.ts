/**
 * Turns errors into JSON replies. An `AppError` is an expected failure and
 * keeps its status and code. Anything else is a bug: it goes to Sentry and
 * the logs, and the caller only sees `internal_error` with the request ID.
 */

import type { Context, ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError, createLogger } from "@igongo/core";
import type { ApiEnv } from "./api-env";

/** Reports an unexpected error (Sentry in production). */
export type ErrorReporter = (error: unknown, c: Context<ApiEnv>) => void;

/** The `onError` handler. */
export function errorHandler(report: ErrorReporter): ErrorHandler<ApiEnv> {
  return (error, c) => {
    const requestId = c.get("requestId");
    if (error instanceof AppError) return c.json({ error: error.code, message: error.message, requestId }, error.status as 400);
    // Hono's own errors (such as a bad JSON body) keep their status.
    if (error instanceof HTTPException) return c.json({ error: "bad_request", message: error.message, requestId }, error.status);
    report(error, c);
    createLogger({ requestId }).log("error", "Unhandled error", { error: String(error), stack: (error as Error)?.stack });
    return c.json({ error: "internal_error", message: "Something went wrong. Please try again.", requestId }, 500);
  };
}

/** The `notFound` handler. */
export const notFound: NotFoundHandler<ApiEnv> = (c) => c.json({ error: "not_found", message: "No such address.", requestId: c.get("requestId") }, 404);
