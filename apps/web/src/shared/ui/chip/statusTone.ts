// Which colour a status word gets. The chip always shows the word too, so
// status is never shown by colour alone. The same rules as the app.

/** The colour family of a status. */
export type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

// Each pattern is checked in order; the first match wins.
const RULES: [StatusTone, RegExp][] = [
  ["error", /(fail|refus|block|lost|overdue|late|error|alarm|absent|out of order|damaged|missed|sold out|over limit|variance|void|expired|dirty|out$)/],
  ["warning", /(wait|pending|low|due|draft|review|probation|repair|busy|queued|degraded|partial|escalat|swap|gap|offline|on hold|needs|shortlist|expiring)/],
  ["success", /(done|paid|approved|active|healthy|online|passed|signed|published|connected|synced|verified|available|free|clean|delivered|claimed|complete|ready|open|in stock|on time|confirmed|inside|given|fixed|on site|answered|sent|inspected|in box)/],
  ["info", /(new|scheduled|booked|in progress|preparing|cooking|assigned|on the way|picked|upcoming|today|enquiry|quoted|running|testing|interview)/],
];

/** Picks a tone from a status word, such as "Blocked" or "Paid". */
export function toneOf(status: string): StatusTone {
  const s = status.toLowerCase();
  return RULES.find(([, re]) => re.test(s))?.[0] ?? "neutral";
}
