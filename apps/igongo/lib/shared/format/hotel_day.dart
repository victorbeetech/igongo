// Dates for the hotel's day. The hotel keeps Uganda time (UTC+3, no daylight
// saving), so "today" is taken in that zone, not the phone's.

/// Month names for [dayWords].
const _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/// Weekday names for [dayWords] (Monday first, as Dart numbers them).
const _weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/// The hotel's day for [now] (the current time by default), as a date with no time of day.
DateTime hotelDay([DateTime? now]) {
  // Step 1: move the instant to Uganda time.
  final local = (now ?? DateTime.now()).toUtc().add(const Duration(hours: 3));
  // Step 2: keep only the calendar day.
  return DateTime(local.year, local.month, local.day);
}

/// [day] as the API takes it, YYYY-MM-DD (the hotel's date, no time).
String dayKey(DateTime day) =>
    '${day.year.toString().padLeft(4, '0')}-${day.month.toString().padLeft(2, '0')}-${day.day.toString().padLeft(2, '0')}';

/// Words for [day] against [today] (the hotel's today by default), such as
/// "Today, 27 Nov 2026", "Tomorrow, 28 Nov 2026" or "Fri 4 Dec 2026".
String dayWords(DateTime day, {DateTime? today}) {
  // Step 1: compare whole days, so the time of day never matters.
  final now = today ?? hotelDay();
  final gap = DateTime(day.year, day.month, day.day).difference(DateTime(now.year, now.month, now.day)).inDays;
  final date = '${day.day} ${_months[day.month - 1]} ${day.year}';
  // Step 2: "Today" and "Tomorrow" for the next two days, the weekday after that.
  if (gap == 0) return 'Today, $date';
  if (gap == 1) return 'Tomorrow, $date';
  return '${_weekdays[day.weekday - 1]} $date';
}
