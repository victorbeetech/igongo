// The hand-made screens of module 85 (Booking Calendar) in the app. S85-01 is
// the guest calendar, live from the API. S85-02 is the super admin's settings,
// which live on the web portal, so the app has no page for it.

import '../../shared/catalog/catalog.dart';
import 'presentation/booking_calendar_screen.dart';

/// Module 85's hand-made screens in the app.
final m85Overrides = <String, ScreenOverride>{
  'S85-01': (_, s) => const BookingCalendarScreen(),
};
