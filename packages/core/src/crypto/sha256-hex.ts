/** SHA-256 hashing, used for audit hash chains and one-way codes. */

/**
 * The SHA-256 of a text, as 64 lowercase hex characters.
 * @param text any UTF-8 text
 */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
