/**
 * Checks a JSON request body against a Zod [schema]. A refused body becomes a
 * 400 reply whose message is the first problem in plain words, so the app can
 * show it to the guest (Zod's default reply has no such sentence).
 */

import { zValidator } from "@hono/zod-validator";
import { AppError } from "@igongo/core";
import type { ZodType } from "zod";

/** The validator for a JSON body; throws a readable `bad_request` on refusal. */
export function checkedJson<T extends ZodType>(schema: T) {
  return zValidator("json", schema, (result) => {
    // Step 1: a valid body passes straight through to the route.
    if (result.success) return;
    // Step 2: a refused body stops here, with the first problem in words.
    const first = result.error.issues[0];
    throw new AppError("bad_request", first?.message ?? "Check the details and try again.");
  });
}
