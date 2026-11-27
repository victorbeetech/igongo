// The bars of the decorative barcode on a ticket. The pattern is made from the
// booking code, so the same code always draws the same bars. It is a visual
// strip only: the QR code beside it is the one the door scans.

/// The bars for [code]: one flag per bit, eight bits per character, true for a
/// bar and false for a gap. Its length is always eight times the code length.
List<bool> barcodeBars(String code) {
  // Step 1: each character's code unit gives eight bits, least significant first.
  final bars = <bool>[];
  for (final unit in code.codeUnits) {
    for (var bit = 0; bit < 8; bit++) {
      bars.add(((unit >> bit) & 1) == 1);
    }
  }
  return bars;
}
