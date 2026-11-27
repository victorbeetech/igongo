// The four steps a booking goes through, and which of them are done. Used by
// the booking status screen and to split My bookings into Upcoming and Past.

import '../../format/day_key.dart';
import 'booking.dart';

/// The step names, in order: request, confirmed, ready (checked in), completed.
const bookingStepWords = ['Request', 'Confirmed', 'Ready', 'Completed'];

/// How many of the four steps are done for [b] on [today] (0 to 4).
int completedSteps(Booking b, DateTime today) {
  return switch (b.status) {
    'cancelled' => 0,
    'requested' || 'awaiting_payment' => 1, // The request is in; waiting for payment or approval.
    'confirmed' => 2,
    'checked_in' => _stayOver(b, today) ? 4 : 3, // In the house now; completed once past the last day.
    'completed' => 4,
    _ => 1, // An unknown status counts as only requested, so nothing claims more than we know.
  };
}

/// True when the stay of [b] ended before [today] (its check-out day, or its one day).
bool _stayOver(Booking b, DateTime today) {
  final last = parseDayKey(b.endDate) ?? parseDayKey(b.date);
  return last != null && dayOnly(last).isBefore(dayOnly(today));
}

/// True when [b] is over: cancelled, or all four steps are done.
bool isPastBooking(Booking b, DateTime today) => b.status == 'cancelled' || completedSteps(b, today) == 4;
