// The hand-made screens of module 71 (Pool), live from the API through
// the shared booking screens. Staff screens use the shared bookings desk.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/bookings_desk_screen.dart';
import 'domain/place.dart';

/// Module 71's hand-made screens.
final m71Overrides = <String, ScreenOverride>{
  'S71-01': (_, s) => BookScreen(s, place),
  'S71-02': (_, s) => BookScreen(s, place),
  'S71-07': (_, s) => BookScreen(s, place),
  'S71-03': (_, s) => BookingsDeskScreen(s, place, status: 'confirmed', todayOnly: true),
};
