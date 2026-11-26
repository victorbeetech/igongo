// The hand-made screens of module 71 (Pool), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import 'domain/place.dart';

/// Module 71's hand-made screens.
final m71Overrides = <String, ScreenOverride>{
  'S71-01': (_, s) => BookScreen(s, place),
  'S71-02': (_, s) => BookScreen(s, place),
  'S71-07': (_, s) => BookScreen(s, place),
};
