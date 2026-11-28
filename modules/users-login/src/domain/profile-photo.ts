/**
 * Rules for a person's own profile photo.
 *
 * The app crops the picture on the phone first, then sends it here as a
 * base64 data URL. The server checks the type and the size, so a huge or
 * unexpected file is refused before it reaches the database.
 */

/** The picture types a profile photo may use. */
export const PROFILE_PHOTO_TYPES = ["image/jpeg", "image/png"] as const;

/** The most a profile photo may weigh once decoded: 300 KB, after the app's crop and resize. */
export const MAX_PROFILE_PHOTO_BYTES = 300 * 1024;

/** A data URL's prefix, for example `data:image/jpeg;base64,`. */
const DATA_URL_PREFIX = /^data:(image\/jpeg|image\/png);base64,/;

/**
 * Checks a profile photo sent as a data URL. Returns the same string when it
 * is acceptable. Throws a RangeError with a sentence the app can show.
 */
export function checkProfilePhoto(dataUrl: string): string {
  // Step 1: the picture type must be one we allow, as a base64 data URL.
  const match = DATA_URL_PREFIX.exec(dataUrl);
  if (!match) throw new RangeError("Choose a JPG or PNG photo.");

  // Step 2: the decoded size must fit the limit. Base64 is about 4/3 of its bytes.
  const payload = dataUrl.slice(match[0].length);
  const bytes = Math.floor((payload.length * 3) / 4) - (payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0);
  if (bytes <= 0) throw new RangeError("The photo is empty.");
  if (bytes > MAX_PROFILE_PHOTO_BYTES) throw new RangeError("The photo is too large. Choose a smaller one.");

  return dataUrl;
}
