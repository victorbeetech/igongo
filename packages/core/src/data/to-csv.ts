/**
 * Turns rows into CSV text that Excel opens: every cell quoted when needed,
 * Windows line ends, and cells starting with = + - @ guarded so a spreadsheet
 * never runs them as formulas. Shared by every export.
 * @example toCsv([["Name", "Net"], ["Sam", 450000]])
 */

export type CsvCell = string | number | boolean | null | undefined | Date;

/** One cell as CSV text. */
function cell(value: CsvCell): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  // Formula guard (CSV injection).
  if (typeof value === "string" && /^[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: CsvCell[][]): string {
  return rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
