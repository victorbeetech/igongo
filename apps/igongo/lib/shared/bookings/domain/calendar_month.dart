// The cells of a month calendar, Sunday first, as the date picker draws them.

import '../../format/day_key.dart';

/// The cells of [month]'s grid, Sunday first, in whole weeks: null for the blank
/// cells before day 1 and after the last day, and a date for each day.
List<DateTime?> monthCells(DateTime month) {
  // Step 1: the first day's column, counting Sunday as 0 (Dart counts Monday as 1 and Sunday as 7).
  final first = DateTime(month.year, month.month);
  final lead = first.weekday % 7;
  // Step 2: the number of days in this month (day 0 of next month is the last day of this one).
  final days = DateTime(month.year, month.month + 1, 0).day;
  final cells = <DateTime?>[
    for (var i = 0; i < lead; i++) null,
    for (var d = 1; d <= days; d++) DateTime(month.year, month.month, d),
  ];
  // Step 3: pad the last week with blanks so the grid is full rows of seven.
  while (cells.length % 7 != 0) {
    cells.add(null);
  }
  return cells;
}

/// True when [day] is before today (a day that can no longer be booked).
bool isPastDay(DateTime day, DateTime today) => dayOnly(day).isBefore(dayOnly(today));
