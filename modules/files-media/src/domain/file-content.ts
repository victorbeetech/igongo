/**
 * Safe uploads: what a file really is, read from its bytes, never from its
 * name or the type the sender claims. Pure rules, used on every upload:
 *
 * - the type comes from the file's first bytes (its "magic number");
 * - it must match the claimed type, and be a photo or PDF we can read;
 * - its structure must be whole (a JPEG ends with its end marker, a PNG has
 *   its header and end chunks, a WebP's size is right, a PDF ends with %%EOF);
 * - a photo that hides a script or page code is refused;
 * - iPhone HEIC photos are refused with a clear message (the Igongo app
 *   converts them to JPEG before sending);
 * - the stored name is the random file ID with the real extension; the
 *   sender's name is never kept.
 */

/** The types Igongo can read and show safely. */
export type ReadableType = "image/jpeg" | "image/png" | "image/webp" | "application/pdf";

/** The extension each readable type is saved with. */
export const EXTENSION: Record<ReadableType, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

/** The largest file of each kind, whatever the super admin's limit (megabytes). */
export const HARD_LIMIT_MB: Record<ReadableType, number> = { "image/jpeg": 10, "image/png": 10, "image/webp": 10, "application/pdf": 20 };

/** True when [bytes] start with [prefix] at [offset]. */
function startsWith(bytes: Uint8Array, prefix: number[], offset = 0): boolean {
  return prefix.every((b, i) => bytes[offset + i] === b);
}

/** [bytes] from [from] to [to] as Latin-1 text (for markers). */
function text(bytes: Uint8Array, from: number, to: number): string {
  const part = bytes.subarray(Math.max(0, from), Math.min(bytes.length, to));
  // In slices, so a 10 MB photo never overflows the call stack.
  let out = "";
  for (let i = 0; i < part.length; i += 8192) out += String.fromCharCode(...part.subarray(i, i + 8192));
  return out;
}

/** True for an iPhone HEIC or HEIF photo (an ISO box `ftyp` with a HEIC brand). */
export function isHeic(bytes: Uint8Array): boolean {
  return text(bytes, 4, 8) === "ftyp" && /^(heic|heix|hevc|heim|heis|mif1|msf1)$/.test(text(bytes, 8, 12));
}

/** What [bytes] really are, or null when they are none of the readable types. */
export function sniffType(bytes: Uint8Array): ReadableType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 12) === "WEBP") return "image/webp";
  if (text(bytes, 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

/** Why the structure of [bytes] (already known to be [type]) is not whole, or null. */
function structureProblem(bytes: Uint8Array, type: ReadableType): string | null {
  const n = bytes.length;
  switch (type) {
    case "image/jpeg":
      // A whole JPEG ends with the end-of-image marker (a few padding bytes are allowed).
      return text(bytes, n - 64, n).includes("\xff\xd9") ? null : "The photo is cut off or damaged.";
    case "image/png": {
      // The first chunk is IHDR with a real size; the last is IEND.
      const width = new DataView(bytes.buffer, bytes.byteOffset).getUint32(16);
      const height = new DataView(bytes.buffer, bytes.byteOffset).getUint32(20);
      const ok = text(bytes, 12, 16) === "IHDR" && width > 0 && height > 0 && width <= 20000 && height <= 20000 && text(bytes, n - 12, n).includes("IEND");
      return ok ? null : "The photo is cut off or damaged.";
    }
    case "image/webp":
      // The RIFF size field is the file's length less 8.
      return new DataView(bytes.buffer, bytes.byteOffset).getUint32(4, true) + 8 === n ? null : "The photo is cut off or damaged.";
    case "application/pdf":
      return text(bytes, n - 1024, n).includes("%%EOF") ? null : "The PDF is cut off or damaged.";
  }
}

/** Page or server code that has no place inside a photo. */
const HIDDEN_CODE = /<\?php|<script|<html|<svg|<iframe|javascript:/i;

/**
 * Why [bytes], sent as [claimedType], may not be stored, or null with the
 * real type when it is safe.
 */
export function checkContent(bytes: Uint8Array, claimedType: string): { problem: string } | { type: ReadableType } {
  // Step 1: iPhone photos get their own message.
  if (isHeic(bytes)) return { problem: "iPhone HEIC photos are not accepted here. Please send it as a JPEG (the Igongo app converts it for you)." };
  // Step 2: the real type, which must be readable and match the claim.
  const type = sniffType(bytes);
  if (!type) return { problem: "This file is not a photo (JPEG, PNG, WebP) or a PDF." };
  if (type !== claimedType) return { problem: "The file's contents do not match its type." };
  // Step 3: the hard limit for the kind.
  if (bytes.length > HARD_LIMIT_MB[type] * 1024 * 1024) return { problem: `Files of this kind can be at most ${HARD_LIMIT_MB[type]} MB.` };
  // Step 4: whole, and with no code hidden inside a photo.
  const broken = structureProblem(bytes, type);
  if (broken) return { problem: broken };
  if (type !== "application/pdf" && HIDDEN_CODE.test(text(bytes, 0, bytes.length))) return { problem: "This photo contains code and cannot be stored." };
  return { type };
}

/** The name a stored file gets: its random ID and the real extension. The sender's name is never kept. */
export function storedName(id: string, type: ReadableType): string {
  return `${id}.${EXTENSION[type]}`;
}
