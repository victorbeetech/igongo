// The decorative barcode: eight bars per character, and the same code draws the same bars.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/ui/ticket/barcode_bars.dart';

void main() {
  test('eight flags per character', () {
    expect(barcodeBars('RB-7KQ2MX').length, 8 * 'RB-7KQ2MX'.length);
  });

  test('the same code always gives the same bars', () {
    expect(barcodeBars('IGH20250428-001'), barcodeBars('IGH20250428-001'));
  });

  test('the bits of each character are read least significant first', () {
    // 'A' is 65 = 0b01000001: bit 0 and bit 6 are set.
    expect(barcodeBars('A'), [true, false, false, false, false, false, true, false]);
  });
}
