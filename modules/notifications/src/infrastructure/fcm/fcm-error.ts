/**
 * Reads an FCM HTTP v1 error answer and decides whether the token is dead.
 * Reference: https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
 */

import type { PushOutcome } from "../../domain/push-result";

/** The parts of an FCM error answer used here. */
interface FcmErrorBody {
  error?: { status?: string; message?: string; details?: { errorCode?: string }[] };
}

/**
 * Maps a failed send to an outcome.
 *
 * - UNREGISTERED: the app was removed or signed out; delete the token.
 * - SENDER_ID_MISMATCH: the token belongs to another Firebase project, which
 *   happens after moving to the hotel's own project; delete it too.
 * - INVALID_ARGUMENT about the token itself: a broken token; delete it.
 * - Anything else (quota, Google down, a bad key) is a plain failure, and the
 *   token is kept.
 */
export function fcmFailure(status: number, body: unknown): { outcome: PushOutcome; detail: string } {
  const error = (body as FcmErrorBody | null)?.error;
  const code = error?.details?.find((d) => d.errorCode)?.errorCode ?? error?.status ?? `HTTP ${status}`;
  const message = error?.message ?? "";
  const dead =
    code === "UNREGISTERED" ||
    code === "SENDER_ID_MISMATCH" ||
    (code === "INVALID_ARGUMENT" && /registration token/i.test(message));
  return { outcome: dead ? "invalid_token" : "failed", detail: message ? `${code}: ${message}` : code };
}
