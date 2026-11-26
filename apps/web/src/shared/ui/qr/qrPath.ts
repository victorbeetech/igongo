// A QR code as one SVG path in a [size] square, for cards, tickets and
// receipts. Uses qrcode-generator (error correction M, automatic size).

import qrcode from "qrcode-generator";

/** The dark squares of [text]'s QR code as an SVG path filling [size] by [size]. */
export function qrPath(text: string, size: number): string {
  const qr = qrcode(0, "M");
  qr.addData(text || " ");
  qr.make();
  const n = qr.getModuleCount();
  const cell = size / n;
  const parts: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) parts.push(`M${(c * cell).toFixed(2)} ${(r * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`);
    }
  }
  return parts.join("");
}
