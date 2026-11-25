// Unit tests for the staff modules' API models: each reads the API's JSON
// the way the screens expect.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m25_attendance/domain/day_summary.dart';
import 'package:igongo/modules/m32_staff_meals/domain/my_meal.dart';
import 'package:igongo/modules/m38_daily_reports/domain/my_report_day.dart';
import 'package:igongo/shared/nfc/hex.dart';

void main() {
  // A report merges my saved answers into the template's sections.
  test('daily report day fills saved answers into the template', () {
    final day = MyReportDay.fromJson({
      'date': '2026-11-25',
      'template': {
        'sections': ['Done', 'Faults'],
        'dueBy': '18:00',
      },
      'report': {
        'status': 'returned',
        'reviewNote': 'More detail',
        'sections': [
          {'title': 'Done', 'text': 'Rooms 1-4'},
        ],
      },
    });
    expect(day.sections.map((s) => s.text), ['Rooms 1-4', '']);
    expect(day.editable, isTrue);
    expect(day.statusWords, 'Returned');
  });

  // No report yet means "Not started" and editable.
  test('a day with no report is new', () {
    final day = MyReportDay.fromJson({
      'date': '2026-11-25',
      'template': {
        'sections': ['Done'],
        'dueBy': '18:00',
      },
      'report': null,
    });
    expect(day.status, 'new');
    expect(day.editable, isTrue);
  });

  // A day's hours read as people say them.
  test('day summary hours', () {
    final d = DaySummary.fromJson({'workDate': '2026-11-25', 'minutesOnSite': 455, 'late': true, 'onSite': false});
    expect(d.hours, '7 h 35 min');
    expect(d.late, isTrue);
  });

  // A meal not yet served has no time.
  test('meal not served', () {
    final m = MyMeal.fromJson({
      'key': 'lunch',
      'name': 'Lunch',
      'startsAt': '12:00',
      'endsAt': '15:00',
      'openNow': true,
    });
    expect(m.servedAt, isNull);
    expect(m.openNow, isTrue);
  });

  // Chip IDs are upper-case hex with no separators.
  test('uid hex', () => expect(uidHex([4, 0xa1, 0xff]), '04A1FF'));
}
