// The hand-made screens of module 69 (Events & Conferences), live from the API through
// the shared booking screens. Staff screens use the shared bookings desk.

import '../../shared/catalog/catalog.dart';
import '../../shared/bookings/presentation/book_screen.dart';
import '../../shared/bookings/presentation/flow/screens/event_room_selection_screen.dart';
import '../../shared/bookings/presentation/bookings_desk_screen.dart';
import '../../shared/bookings/presentation/my_bookings_screen.dart';
import 'domain/place.dart';

/// Module 69's hand-made screens.
final m69Overrides = <String, ScreenOverride>{
  'S69-01': (_, s) => BookScreen(s, place),
  // S69-02 Event enquiry: the designed venue, occasion and guest request, sent to the events team from the events API.
  'S69-02': (_, s) => const EventRoomSelectionScreen(place: place),
  'S69-12': (_, s) => MyBookingsScreen(s, place),
  'S69-03': (_, s) => BookingsDeskScreen(s, place, status: 'requested'),
  'S69-10': (_, s) => BookingsDeskScreen(s, place, status: 'confirmed', todayOnly: true),
};
