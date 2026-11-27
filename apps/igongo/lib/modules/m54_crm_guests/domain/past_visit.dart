// One past visit: a booking, and the place it was made at (so its receipt
// and status open against the right module).

import '../../../shared/bookings/domain/booking.dart';
import '../../../shared/bookings/domain/booking_place.dart';
import '../../../shared/bookings/domain/booking_timeline.dart';

/// A booking over (or cancelled), with the place it belongs to.
class PastVisit {
  /// Creates a visit.
  const PastVisit({required this.place, required this.booking});

  /// The booking module the visit was made at.
  final BookingPlace place;

  /// The booking itself, as the server last returned it.
  final Booking booking;
}

/// Keeps the visits that are over (or cancelled) on [today], newest day first.
/// A booking with no day sorts last. Pure, so the rule is tested without the API.
List<PastVisit> pastVisitsNewestFirst(Iterable<PastVisit> all, DateTime today) {
  // Step 1: keep only the visits that are over or cancelled.
  final past = [for (final v in all) if (isPastBooking(v.booking, today)) v];
  // Step 2: sort by the day, newest first (yyyy-mm-dd text sorts by day).
  past.sort((a, b) => (b.booking.date ?? '').compareTo(a.booking.date ?? ''));
  return past;
}
