/**
 * The rule for matching a guest account to a staff record, so the super
 * admin can make them staff. Pure functions.
 *
 * The staff number picks the record. The phone the person gives must be the
 * record's phone, and the account's name must share a real word with the
 * record's name (so "Sam Okello" matches "Samuel Okello", and "O'Brien"
 * matches "o’brien"), ignoring case, accents and apostrophes.
 */

/** "Nakato  O’Brien-Kizza" becomes ["nakato", "obrien", "kizza"]. */
export function nameWords(name: string): string[] {
  return name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’`]/g, "")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 3);
}

/** True when the two names share at least one word of three letters or more. */
export function namesMatch(a: string, b: string): boolean {
  const words = new Set(nameWords(a));
  return nameWords(b).some((w) => words.has(w));
}

/** The last nine digits: "+256 772 123 456", "0772123456" and "772123456" are the same phone. */
export function phoneKey(phone: string): string {
  return phone.replace(/\D/g, "").slice(-9);
}

export function phonesMatch(a: string | null, b: string | null): boolean {
  return !!a && !!b && phoneKey(a).length === 9 && phoneKey(a) === phoneKey(b);
}
