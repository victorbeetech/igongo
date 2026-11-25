/**
 * The one error type every API module throws on purpose. The API shell turns
 * it into a JSON reply `{ error: code, message, requestId }` with its HTTP
 * status. Anything else thrown is a bug: it is sent to Sentry and the caller
 * only sees `internal_error`.
 */

/** A short machine-readable reason, such as `permission_denied`. */
export type AppErrorCode =
  | "bad_request"
  | "sign_in_required"
  | "permission_denied"
  | "not_found"
  | "conflict"
  | "method_disabled"
  | "module_disabled"
  | "not_configured"
  | "rate_limited"
  | "internal_error";

/** The HTTP status for each code. */
const STATUS: Record<AppErrorCode, number> = {
  bad_request: 400,
  sign_in_required: 401,
  permission_denied: 403,
  not_found: 404,
  conflict: 409,
  method_disabled: 403,
  module_disabled: 503,
  not_configured: 503,
  rate_limited: 429,
  internal_error: 500,
};

/** An expected failure with a code, a human message and an HTTP status. */
export class AppError extends Error {
  /** The HTTP status sent to the caller. */
  readonly status: number;

  /**
   * @param code    the machine-readable reason
   * @param message a short sentence a person can read
   */
  constructor(
    readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
    this.status = STATUS[code];
  }
}
