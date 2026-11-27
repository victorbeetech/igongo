// The check that two password boxes hold exactly the same text. Kept in one
// place so every web form uses the same rule and message, the same as the app.

/** The message shown when the password and its "again" box differ. */
export const PASSWORDS_DIFFER_MESSAGE = "The two passwords are not the same.";

/** True when [password] and [again] hold exactly the same text (case and spaces count). */
export function passwordsMatch(password: string, again: string): boolean {
  // Step 1: a plain exact comparison, the same rule as the server and the app.
  return password === again;
}
