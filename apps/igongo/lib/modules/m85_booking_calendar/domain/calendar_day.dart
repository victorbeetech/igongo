// One day on the booking calendar: its date, its status, and the rooms sold that day.

import '../../../shared/api/api_client.dart';
import 'calendar_day_status.dart';
import 'calendar_room.dart';

/// One day of the calendar.
class CalendarDay {
  /// Creates a day.
  const CalendarDay({required this.date, required this.status, required this.rooms});

  /// Reads one day from the API's JSON (`date` as YYYY-MM-DD, `status`, and `rooms`).
  factory CalendarDay.fromJson(Json json) => CalendarDay(
    date: DateTime.parse('${json['date']}'),
    status: CalendarDayStatus.fromKey('${json['status']}'),
    rooms: [for (final room in (json['rooms'] as List? ?? const [])) CalendarRoom.fromJson(room as Json)],
  );

  /// The calendar date, with no time of day.
  final DateTime date;

  /// Open, Spots full or closed.
  final CalendarDayStatus status;

  /// The rooms on sale that day, with their units left.
  final List<CalendarRoom> rooms;
}
