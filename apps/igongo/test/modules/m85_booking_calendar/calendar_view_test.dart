// Tests for the booking calendar's read model: how the API's reply becomes
// days with a status, and how the calendar reads when it is switched off.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m85_booking_calendar/domain/calendar_day_status.dart';
import 'package:igongo/modules/m85_booking_calendar/domain/calendar_view.dart';

void main() {
  group('CalendarView', () {
    test('reads each day status and the units left', () {
      final view = CalendarView.fromJson({
        'enabled': true,
        'days': [
          {
            'date': '2026-12-01',
            'status': 'open',
            'rooms': [
              {'offeringId': 'rm_1', 'name': 'Garden Room', 'left': 2},
            ],
          },
          {
            'date': '2026-12-02',
            'status': 'spots_full',
            'rooms': [
              {'offeringId': 'rm_1', 'name': 'Garden Room', 'left': 0},
            ],
          },
        ],
      });
      expect(view.enabled, isTrue);
      expect(view.days, hasLength(2));
      expect(view.dayFor(DateTime(2026, 12, 1))?.status, CalendarDayStatus.open);
      expect(view.dayFor(DateTime(2026, 12, 2))?.status, CalendarDayStatus.spotsFull);
      expect(view.dayFor(DateTime(2026, 12, 2))?.rooms.single.left, 0);
    });

    test('a day the calendar does not hold is not found', () {
      final view = CalendarView.fromJson({'enabled': true, 'days': []});
      expect(view.dayFor(DateTime(2026, 12, 1)), isNull);
    });

    test('an unknown status word counts as closed', () {
      expect(CalendarDayStatus.fromKey('something_new'), CalendarDayStatus.closed);
    });

    test('a switched-off calendar has no days', () {
      final view = CalendarView.fromJson({'enabled': false, 'days': []});
      expect(view.enabled, isFalse);
      expect(view.days, isEmpty);
    });
  });
}
