/** The password rules from the policy. Pure function, used on sign-up, reset and change. */

import type { LoginPolicy } from "./login-policy";

/** Why [password] breaks the rules, or null when it is fine. */
export function passwordProblem(password: string, policy: Pick<LoginPolicy, "passwordMinLength" | "passwordNeedsLetterAndNumber">): string | null {
  if (password.length < policy.passwordMinLength) return `Passwords need at least ${policy.passwordMinLength} characters.`;
  if (policy.passwordNeedsLetterAndNumber && !(/\p{L}/u.test(password) && /\p{N}/u.test(password))) return "Passwords need at least one letter and one number.";
  return null;
}
