// Live booking data for the booking screens (Riverpod), one family per module place.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/bookings_api.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/offering.dart';

/// The bookings API of [place].
final bookingsApiProvider = Provider.family<BookingsApi, BookingPlace>(
  (ref, place) => BookingsApi(ref.watch(apiClientProvider), place),
);

/// What [place] has on sale; reloads when the session changes.
final offeringsProvider = FutureProvider.autoDispose.family<List<Offering>, BookingPlace>((ref, place) {
  ref.watch(sessionProvider);
  return ref.watch(bookingsApiProvider(place)).offerings();
});

/// My bookings at [place].
final myBookingsProvider = FutureProvider.autoDispose.family<List<Booking>, BookingPlace>((ref, place) {
  ref.watch(sessionProvider);
  return ref.watch(bookingsApiProvider(place)).mine();
});

/// The staff desk's filter: a [status] (null for all) and a [date] (null for any day).
typedef DeskFilter = ({BookingPlace place, String? status, String? date});

/// Every booking at a place, for staff, with [DeskFilter].
final deskBookingsProvider = FutureProvider.autoDispose.family<List<Booking>, DeskFilter>((ref, f) {
  ref.watch(sessionProvider);
  return ref.watch(bookingsApiProvider(f.place)).desk(status: f.status, date: f.date);
});
