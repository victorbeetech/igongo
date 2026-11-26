/** Email and name clean-up, the same everywhere: sign-up, sign-in and the staff match. */

/** Lowercase, no spaces around: " Ann@Example.COM " becomes "ann@example.com". */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Apple "Hide My Email" relay addresses, such as abc123@privaterelay.appleid.com. */
export function isAppleRelay(email: string): boolean {
  return normalizeEmail(email).endsWith("@privaterelay.appleid.com");
}

/** A display name with single spaces. Apostrophes and any language's letters are kept as typed. */
export function tidyName(name: string): string {
  return name.normalize("NFC").trim().replace(/\s+/g, " ");
}
