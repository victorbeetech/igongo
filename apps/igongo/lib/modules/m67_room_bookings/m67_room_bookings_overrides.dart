// The hand-made screens of module 67 (Room Bookings), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 67's hand-made screens.
final m67Overrides = <String, ScreenOverride>{
  'S67-01': (_, s) => BookScreen(s, place),
  'S67-02': (_, s) => BookScreen(s, place),
  'S67-03': (_, s) => BookScreen(s, place),
  'S67-04': (_, s) => BookScreen(s, place),
  'S67-06': (_, s) => MyBookingsScreen(s, place),
};
