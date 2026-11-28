// The booking calendar for a run of days, as `GET /api/calendar` sends it.
// When the super admin has switched the calendar off, [enabled] is false and
// there are no days.

import '../../../shared/api/api_client.dart';
import '../../../shared/format/day_key.dart';
import 'calendar_day.dart';

/// The calendar: whether guests may see it, and its days.
class CalendarView {
  /// Creates the calendar.
  const CalendarView({required this.enabled, this.days = const []});

  /// Reads the calendar from the API's JSON. Only `enabled` and `days` are used; the rest is ignored.
  factory CalendarView.fromJson(Json json) => CalendarView(
    enabled: json['enabled'] == true,
    days: [for (final day in (json['days'] as List? ?? const [])) CalendarDay.fromJson(day as Json)],
  );

  /// False when the super admin has switched the calendar off.
  final bool enabled;

  /// The days returned, in date order. Days past the super admin's window are not in the list.
  final List<CalendarDay> days;

  /// The day for [date], or null when the calendar does not hold it (outside the window or the month asked for).
  CalendarDay? dayFor(DateTime date) {
    // Step 1: compare the calendar date keys, so the time of day never matters.
    final key = dayKey(date);
    for (final day in days) {
      if (dayKey(day.date) == key) return day;
    }
    return null;
  }
}
