// The hand-made screens of module 70 (Venues & Equipment), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import 'domain/place.dart';

/// Module 70's hand-made screens.
final m70Overrides = <String, ScreenOverride>{
  'S70-01': (_, s) => BookScreen(s, place),
  'S70-04': (_, s) => BookScreen(s, place),
};
