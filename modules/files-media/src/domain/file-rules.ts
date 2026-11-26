/**
 * The super admin's upload limits (S11-05): the largest file and the types
 * allowed. Checked on every upload.
 */

export interface FileRules {
  /** The largest file in megabytes. */
  maxMb: number;
  /** MIME types allowed, such as `image/jpeg`. */
  allowedTypes: string[];
}

export const DEFAULT_FILE_RULES: FileRules = { maxMb: 8, allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"] };

/** Why [file] breaks [rules], or null when it is fine. */
export function ruleBreak(rules: FileRules, file: { type: string; size: number }): string | null {
  if (!rules.allowedTypes.includes(file.type)) return `Files of type ${file.type} are not allowed.`;
  if (file.size > rules.maxMb * 1024 * 1024) return `Files can be at most ${rules.maxMb} MB.`;
  if (file.size === 0) return "The file is empty.";
  return null;
}
