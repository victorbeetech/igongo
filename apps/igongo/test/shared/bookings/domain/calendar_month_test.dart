// The month grid: Sunday first, whole weeks, blanks before and after the month.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/calendar_month.dart';

void main() {
  test('April 2025 starts on a Tuesday, so two blanks (Sunday, Monday) come before the 1st', () {
    final cells = monthCells(DateTime(2025, 4));
    expect(cells[0], isNull);
    expect(cells[1], isNull);
    expect(cells[2], DateTime(2025, 4));
    expect(cells.whereType<DateTime>().length, 30);
  });

  test('the grid is always whole weeks of seven', () {
    for (var m = 1; m <= 12; m++) {
      expect(monthCells(DateTime(2026, m)).length % 7, 0, reason: 'month $m');
    }
  });

  test('a month that starts on Sunday has no leading blanks', () {
    // 1 Feb 2026 is a Sunday.
    final cells = monthCells(DateTime(2026, 2));
    expect(cells.first, DateTime(2026, 2));
  });

  test('past days are reported as past, today is not', () {
    final today = DateTime(2026, 11, 26, 15, 30);
    expect(isPastDay(DateTime(2026, 11, 25), today), isTrue);
    expect(isPastDay(DateTime(2026, 11, 26), today), isFalse);
    expect(isPastDay(DateTime(2026, 11, 27), today), isFalse);
  });
}
