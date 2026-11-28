// Date helpers for the booking-flow date strips. Days start from today, so the
// strip always shows the next few real days.

/// Returns [count] consecutive days starting today, at midnight.
List<DateTime> flowNextDays(int count) {
  // Step 1: today at midnight, so the strip compares whole days only.
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  // Step 2: add one day per entry.
  return [for (var i = 0; i < count; i++) DateTime(today.year, today.month, today.day + i)];
}

/// Three-letter weekday name for [date], for example "Thu".
String flowWeekdayShort(DateTime date) => const ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.weekday - 1];

/// Three-letter month name for [date], for example "Oct".
String flowMonthShort(DateTime date) => const [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
][date.month - 1];
