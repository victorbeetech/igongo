// What guests see for one day of the booking calendar: open, Spots full or
// closed. The API decides it; the app only reads the word it sends.

/// The status of one day on the calendar.
enum CalendarDayStatus {
  /// Rooms are free to book on this day.
  open,

  /// Spots full: the rooms (every one, or any one, per the super admin's rule) are taken.
  spotsFull,

  /// Not bookable: a past day, a weekday the hotel does not open, or a day with nothing on sale.
  closed;

  /// Reads the API's word for a status (`open`, `spots_full` or `closed`). Any other word counts as closed.
  static CalendarDayStatus fromKey(String key) => switch (key) {
    'open' => CalendarDayStatus.open,
    'spots_full' => CalendarDayStatus.spotsFull,
    _ => CalendarDayStatus.closed,
  };
}
