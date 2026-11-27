// Calendar days as the API reads them: `YYYY-MM-DD`, with no time of day, so a
// day picked on the phone is the same day on the server.

/// Strips the time of day from [d], keeping the calendar date.
DateTime dayOnly(DateTime d) => DateTime(d.year, d.month, d.day);

/// [d] as `YYYY-MM-DD` (its calendar date, in the phone's time zone).
String dayKey(DateTime d) {
  // Step 1: pad the year to four digits and the month and day to two.
  String two(int n) => n.toString().padLeft(2, '0');
  return '${d.year.toString().padLeft(4, '0')}-${two(d.month)}-${two(d.day)}';
}

/// The day in a `YYYY-MM-DD` string from the API, or null when it is missing or not a date.
DateTime? parseDayKey(String? key) => key == null ? null : DateTime.tryParse(key);
