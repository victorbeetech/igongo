// The hand-made screens of module 64 (Tables & Dine-in), live from the API through
// the shared booking screens. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import 'domain/place.dart';

/// Module 64's hand-made screens.
final m64Overrides = <String, ScreenOverride>{'S64-04': (_, s) => BookScreen(s, place)};
