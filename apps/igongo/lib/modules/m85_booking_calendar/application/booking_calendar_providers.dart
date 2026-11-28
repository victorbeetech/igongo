// Booking calendar live data for the app (Riverpod): the API calls and one
// month of the calendar at a time.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/booking_calendar_api.dart';
import '../domain/calendar_view.dart';

/// The booking calendar API on the app's client.
final bookingCalendarApiProvider = Provider((ref) => BookingCalendarApi(ref.watch(apiClientProvider)));

/// One month of the calendar, keyed by the month's first day. It reloads when the person signs in or out.
final bookingCalendarMonthProvider = FutureProvider.autoDispose.family<CalendarView, DateTime>((ref, monthStart) {
  // Step 1: depend on the session, so the calendar refreshes after sign-in or sign-out.
  ref.watch(sessionProvider);
  // Step 2: ask for every day of that month (the day count of the month, from the first day).
  final daysInMonth = DateTime(monthStart.year, monthStart.month + 1, 0).day;
  return ref.watch(bookingCalendarApiProvider).days(from: monthStart, days: daysInMonth);
});
