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
