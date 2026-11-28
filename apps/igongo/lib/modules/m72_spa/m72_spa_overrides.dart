// The hand-made screens of module 72 (Spa / Humura), live from the API through
// the shared booking screens. Staff screens use the shared bookings desk.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/bookings_desk_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import '../../shared/bookings/presentation/flow/screens/spa_payment_confirmation_screen.dart';
import 'domain/place.dart';

/// Module 72's hand-made screens.
final m72Overrides = <String, ScreenOverride>{
  'S72-01': (_, s) => BookScreen(s, place),
  'S72-02': (_, s) => BookScreen(s, place),
  // S72-03 Book treatment: the designed treatment, time and payment screen, live from the spa API.
  'S72-03': (_, s) => const SpaPaymentConfirmationScreen(place: place),
  'S72-05': (_, s) => MyBookingsScreen(s, place),
  'S72-06': (_, s) => BookingsDeskScreen(s, place, todayOnly: true),
  'S72-07': (_, s) => BookingsDeskScreen(s, place, todayOnly: true),
};
