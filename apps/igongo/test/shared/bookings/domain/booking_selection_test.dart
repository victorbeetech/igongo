// The picked days: nights between check-in and check-out, and the API day keys.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking_selection.dart';
import 'package:igongo/shared/format/day_key.dart';

void main() {
  test('a stay counts its nights from check-in to check-out', () {
    final s = BookingSelection(from: DateTime(2025, 4, 28), to: DateTime(2025, 5));
    expect(s.nights, 3);
    expect(s.fromKey, '2025-04-28');
    expect(s.toKey, '2025-05-01');
  });

  test('a single day has no nights and no check-out key', () {
    final s = BookingSelection(from: DateTime(2026, 1, 9));
    expect(s.nights, 0);
    expect(s.toKey, isNull);
    expect(s.fromKey, '2026-01-09');
  });

  test('day keys pad the month and day', () {
    expect(dayKey(DateTime(2026, 3, 4)), '2026-03-04');
    expect(parseDayKey('2026-03-04'), DateTime(2026, 3, 4));
    expect(parseDayKey(null), isNull);
  });
}
