// The error every API call throws when the API says no. It carries the
// API's machine-readable code (such as `permission_denied`) and the request
// ID, which support can look up in the logs and Sentry.

/** A refused or failed API call. */
export class ApiError extends Error {
  constructor(
    /** The HTTP status, or 0 when the network failed. */
    readonly status: number,
    /** The API's code, such as `sign_in_required` or `METHOD_DISABLED`. */
    readonly code: string,
    message: string,
    /** The request ID from the API, when there is one. */
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /** True when the person must sign in first. */
  get needsSignIn(): boolean {
    return this.status === 401;
  }

  /** True when the person's roles do not allow it. */
  get denied(): boolean {
    return this.status === 403;
  }
}
