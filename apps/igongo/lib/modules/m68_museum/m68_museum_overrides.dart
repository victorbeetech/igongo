// The hand-made screens of module 68 (Museum), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 68's hand-made screens.
final m68Overrides = <String, ScreenOverride>{
  'S68-01': (_, s) => BookScreen(s, place),
  'S68-02': (_, s) => BookScreen(s, place),
  'S68-03': (_, s) => BookScreen(s, place),
  'S68-09': (_, s) => BookScreen(s, place),
  'S68-05': (_, s) => MyBookingsScreen(s, place),
};
