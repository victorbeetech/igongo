/**
 * Reads the Firebase service-account key (the JSON file downloaded from the
 * Firebase console). It is stored as the Cloudflare secret
 * `FCM_SERVICE_ACCOUNT`, or pasted by the super admin in Integrations >
 * Connection settings > Firebase. It is never logged or returned by any API.
 */

import { z } from "zod";

/** The fields of the key file that sending needs. */
const serviceAccountSchema = z.object({
  project_id: z.string().min(1),
  client_email: z.string().email(),
  private_key: z.string().includes("PRIVATE KEY"),
  token_uri: z.string().url().default("https://oauth2.googleapis.com/token"),
});

/** A parsed service-account key. */
export type ServiceAccount = z.infer<typeof serviceAccountSchema>;

/**
 * Parses the key file's text. Returns null when it is missing or not a valid
 * key, so the caller can switch push off instead of crashing.
 */
export function parseServiceAccount(json: string | undefined): ServiceAccount | null {
  if (!json) return null;
  try {
    const result = serviceAccountSchema.safeParse(JSON.parse(json));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
