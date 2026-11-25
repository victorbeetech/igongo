/**
 * Names for stored keys: `provider.field`, such as `google.client_secret`,
 * `apple.private_key` or `mtn_momo.api_key`. Known names are listed so the
 * console can show what is missing; other well-formed names are allowed for
 * new providers without a code change.
 */

const NAME = /^[a-z][a-z0-9_]{1,30}\.[a-z][a-z0-9_]{1,40}$/;

/** True when [key] is a well-formed key name. */
export function isValidSecretKey(key: string): boolean {
  return NAME.test(key);
}

/** The keys the system knows how to use, by provider. */
export const KNOWN_SECRET_KEYS = [
  "google.client_id",
  "google.client_secret",
  "apple.team_id",
  "apple.key_id",
  "apple.client_id",
  "apple.private_key",
  "apple.app_bundle_id",
  "africas_talking.api_key",
  "africas_talking.username",
  "whatsapp.access_token",
  "whatsapp.phone_number_id",
  "resend.api_key",
  "mtn_momo.api_key",
  "mtn_momo.subscription_key",
  "airtel_money.client_id",
  "airtel_money.client_secret",
  "flutterwave.secret_key",
  "flutterwave.public_key",
  "google_maps.api_key",
] as const;
