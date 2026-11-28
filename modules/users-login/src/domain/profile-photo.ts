/**
 * Rules for a person's own profile photo.
 *
 * The app crops the picture on the phone first, then sends it here as a
 * base64 data URL. The server checks the type and the size, so a huge or
 * unexpected file is refused before it reaches the database.
 */

/** The most a profile photo may weigh once decoded: 300 KB, after the app's crop and resize. */
export const MAX_PROFILE_PHOTO_BYTES = 300 * 1024;

/** A data URL's prefix, for example `data:image/jpeg;base64,`. */
const DATA_URL_PREFIX = /^data:(image\/jpeg|image\/png);base64,/;

/** The payload after the prefix must be base64 characters only, with up to two `=` at the end. */
const BASE64_PAYLOAD = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * Checks a profile photo sent as a data URL. Returns the same string when it
 * is acceptable. Throws a RangeError with a sentence the app can show.
 */
export function checkProfilePhoto(dataUrl: string): string {
  // Step 1: the picture type must be one we allow, as a base64 data URL.
  const match = DATA_URL_PREFIX.exec(dataUrl);
  if (!match) throw new RangeError("Choose a JPG or PNG photo.");

  // Step 2: the payload must be base64, and its decoded size must fit the limit (base64 is about 4/3 of the bytes).
  const payload = dataUrl.slice(match[0].length);
  if (!BASE64_PAYLOAD.test(payload)) throw new RangeError("Choose a JPG or PNG photo.");
  const bytes = Math.floor((payload.length * 3) / 4) - (payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0);
  if (bytes <= 0) throw new RangeError("The photo is empty.");
  if (bytes > MAX_PROFILE_PHOTO_BYTES) throw new RangeError("The photo is too large. Choose a smaller one.");

  return dataUrl;
}
