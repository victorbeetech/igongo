// The hand-made screens of module 73 (Crafts & Bookshop), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 73's hand-made screens.
final m73Overrides = <String, ScreenOverride>{
  'S73-01': (_, s) => BookScreen(s, place),
  'S73-02': (_, s) => BookScreen(s, place),
  'S73-03': (_, s) => MyBookingsScreen(s, place),
};
