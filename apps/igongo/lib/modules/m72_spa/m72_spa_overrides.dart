// The hand-made screens of module 72 (Spa / Humura), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 72's hand-made screens.
final m72Overrides = <String, ScreenOverride>{
  'S72-01': (_, s) => BookScreen(s, place),
  'S72-02': (_, s) => BookScreen(s, place),
  'S72-03': (_, s) => BookScreen(s, place),
  'S72-05': (_, s) => MyBookingsScreen(s, place),
};
