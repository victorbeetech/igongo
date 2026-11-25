// Small helpers that make sample text look real: names, times and row
// subtitles. All invented for the prototype. The same as the app's SampleText.

import type { ModuleMock } from "@/shared/catalog/types";

/** Invented staff and guest names. */
export const PEOPLE = ["Atuhaire Grace", "Mugisha Brian", "Kyomuhendo Sarah", "Tumusiime Ronald", "Natukunda Esther", "Byaruhanga Joel", "Kansiime Doreen", "Okello James"];

const TIMES = ["07:52", "08:30", "09:15", "11:40", "13:05", "16:00", "18:20", "21:45"];

/** The status for row [i], cycling through the module's statuses. */
export const statusFor = (mock: ModuleMock, i: number) => mock.statuses[i % mock.statuses.length]!;

/** A subtitle for row [i], such as "Today 09:15 · Mugisha Brian". */
export const subtitleFor = (i: number) => `${i < 3 ? "Today" : "Yesterday"} ${TIMES[i % TIMES.length]} · ${PEOPLE[(i + 3) % PEOPLE.length]}`;

/** A sample value for a form field, chosen from words in its label. */
export function hintFor(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("phone")) return "+256 772 000 111";
  if (l.includes("email")) return "name@example.com";
  if (l.includes("name") || l.includes("person") || l.includes("who")) return PEOPLE[0]!;
  if (/(date|from|to|when)/.test(l)) return "28 Nov 2026";
  if (l.includes("time")) return "16:00";
  if (/(amount|price|value)/.test(l)) return "UGX 0";
  if (/(number|quantity|nights|guests)/.test(l)) return "1";
  return label;
}
