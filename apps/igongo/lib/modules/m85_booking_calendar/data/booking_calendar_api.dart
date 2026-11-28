// The booking calendar endpoint the app uses (`GET /api/calendar`). It returns
// availability only: each day's status and each room's units left. No guest
// names, phones or booking details ever come back.

import '../../../shared/api/api_client.dart';
import '../../../shared/format/day_key.dart';
import '../domain/calendar_view.dart';

/// Calls the booking calendar API.
class BookingCalendarApi {
  /// Creates the calls on [_api].
  const BookingCalendarApi(this._api);

  /// The shared API client, which sends the person's session when there is one.
  final ApiClient _api;

  /// The calendar for [days] days from [from] (a calendar date; only its day is used).
  Future<CalendarView> days({required DateTime from, required int days}) async {
    // Step 1: the start day as YYYY-MM-DD, and how many days to return.
    final path = '/api/calendar?from=${dayKey(from)}&days=$days';
    // Step 2: the reply, read into the calendar model.
    return CalendarView.fromJson(await _api.get(path));
  }
}
