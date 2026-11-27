// The hand-made screens of module 67 (Room Bookings), live from the API through
// the shared booking screens. Staff screens use the shared bookings desk.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/bookings_home_screen.dart';
import '../../shared/bookings/presentation/bookings_desk_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 67's hand-made screens.
final m67Overrides = <String, ScreenOverride>{
  'S67-01': (_, s) => BookingsHomeScreen(s),
  'S67-02': (_, s) => BookScreen(s, place),
  'S67-03': (_, s) => BookScreen(s, place),
  'S67-04': (_, s) => BookScreen(s, place),
  'S67-06': (_, s) => MyBookingsScreen(s, place),
  'S67-05': (_, s) => MyBookingsScreen(s, place),
  'S67-07': (_, s) => MyBookingsScreen(s, place),
  'S67-10': (_, s) => BookingsDeskScreen(s, place),
  'S67-11': (_, s) => BookingsDeskScreen(s, place, status: 'confirmed', todayOnly: true),
  'S67-12': (_, s) => BookingsDeskScreen(s, place, status: 'checked_in'),
};
