// Past visits (Me > Past visits): only the bookings that are over or cancelled
// show, newest day first, and a booking is never shown as past before its day ends.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m54_crm_guests/domain/past_visit.dart';
import 'package:igongo/modules/m54_crm_guests/domain/visit_places.dart';
import 'package:igongo/shared/bookings/domain/booking.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';

/// A booking on [date] with [status], for the rules under test.
Booking _booking(String id, String? date, String status) => Booking(
  id: id,
  code: 'RB-$id',
  qr: 'IGG-BK:RB-$id',
  offeringName: 'Stay $id',
  units: 1,
  total: 100000,
  paid: 100000,
  status: status,
  date: date,
);

/// A visit at the rooms place, for [b].
PastVisit _visit(Booking b) => PastVisit(place: guestVisitPlaces.first, booking: b);

void main() {
  // Step 1: the day of the check.
  final today = DateTime(2026, 11, 27);

  test('keeps only stays that are over or cancelled', () {
    final visits = pastVisitsNewestFirst([
      _visit(_booking('old', '2026-10-02', 'checked_in')),
      _visit(_booking('upcoming', '2026-12-20', 'confirmed')),
      _visit(_booking('gone', '2026-12-01', 'cancelled')),
    ], today);
    // Newest day first: the cancelled 1 Dec booking comes before the 2 Oct stay.
    expect(visits.map((v) => v.booking.id), ['gone', 'old']);
  });

  test('sorts newest day first', () {
    final visits = pastVisitsNewestFirst([
      _visit(_booking('a', '2026-09-01', 'checked_in')),
      _visit(_booking('b', '2026-11-20', 'checked_in')),
      _visit(_booking('c', '2026-10-15', 'checked_in')),
    ], today);
    expect(visits.map((v) => v.booking.id), ['b', 'c', 'a']);
  });

  test('lists nothing when there are no bookings', () {
    expect(pastVisitsNewestFirst(const [], today), isEmpty);
  });

  test('visit places include the stays and passes and leave out equipment hire', () {
    final paths = guestVisitPlaces.map((BookingPlace p) => p.path);
    expect(paths, containsAll(['/api/rooms', '/api/pool', '/api/museum']));
    expect(paths, isNot(contains('/api/venues')));
  });
}
