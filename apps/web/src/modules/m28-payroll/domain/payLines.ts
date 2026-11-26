// Pay lines typed as text, one per line, such as "Transport = 50000", so
// allowances and adjustments need no grid editor.

/** A named amount on a payslip. */
export interface PayLine {
  name: string;
  amount: number;
}

/** Lines to text, one "Name = amount" per line. */
export const linesToText = (lines: PayLine[]) => lines.map((l) => `${l.name} = ${l.amount}`).join("\n");

/** Text to lines; lines without a name or a number are skipped. */
export function textToLines(text: string): PayLine[] {
  return text
    .split("\n")
    .map((row) => row.split("="))
    .filter((parts) => parts.length === 2 && parts[0]!.trim() && !Number.isNaN(Number(parts[1]!.trim().replace(/,/g, ""))))
    .map(([name, amount]) => ({ name: name!.trim(), amount: Math.round(Number(amount!.trim().replace(/,/g, ""))) }));
}
