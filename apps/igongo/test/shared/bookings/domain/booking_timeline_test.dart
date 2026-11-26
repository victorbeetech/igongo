// The booking's four steps, and which bookings are past.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking.dart';
import 'package:igongo/shared/bookings/domain/booking_timeline.dart';

Booking _b(String status, {String? date, String? endDate}) => Booking(
  id: '1',
  code: 'RB-1',
  qr: 'IGG:RB-1',
  offeringName: 'Standard Room',
  units: 1,
  total: 180000,
  paid: 0,
  status: status,
  date: date,
  endDate: endDate,
);

void main() {
  final today = DateTime(2026, 11, 26);

  test('each status maps to how many steps are done', () {
    expect(completedSteps(_b('cancelled'), today), 0);
    expect(completedSteps(_b('requested'), today), 1);
    expect(completedSteps(_b('awaiting_payment'), today), 1);
    expect(completedSteps(_b('confirmed'), today), 2);
    expect(completedSteps(_b('mystery'), today), 1);
  });

  test('a checked-in stay is Ready, then Completed once past its last day', () {
    expect(completedSteps(_b('checked_in', date: '2026-11-25', endDate: '2026-11-28'), today), 3);
    expect(completedSteps(_b('checked_in', date: '2026-11-20', endDate: '2026-11-25'), today), 4);
  });

  test('cancelled and completed bookings are past; the rest are upcoming', () {
    expect(isPastBooking(_b('cancelled'), today), isTrue);
    expect(isPastBooking(_b('checked_in', date: '2026-11-01', endDate: '2026-11-02'), today), isTrue);
    expect(isPastBooking(_b('confirmed', date: '2026-12-01'), today), isFalse);
  });
}
