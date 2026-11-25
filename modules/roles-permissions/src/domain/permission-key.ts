/**
 * The rules for a permission key: `module.feature.action`, lowercase words
 * with dashes, `*` allowed in any part. Actions are the eight standard ones
 * (modules spec, "Standard actions") plus a few module-specific verbs.
 */

/** The standard actions every module uses. */
export const STANDARD_ACTIONS = ["view", "create", "edit", "approve", "delete", "export", "comment", "like"] as const;

const PART = /^(\*|[a-z0-9]+(-[a-z0-9]+)*)$/;

/** True when [key] is `*` or three valid parts. */
export function isValidPermissionKey(key: string): boolean {
  if (key === "*") return true;
  const parts = key.split(".");
  return parts.length === 3 && parts.every((p) => PART.test(p));
}
