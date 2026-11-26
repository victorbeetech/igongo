// Which booking module a screen talks to: its API path, module key (for
// payments) and the word for one unit. Rooms, Museum, Events, Pool and the
// Shop each pass their own.

/// A booking module's place in the API.
class BookingPlace {
  /// Creates a place.
  const BookingPlace({required this.path, required this.module, required this.unit});

  /// The API path, such as `/api/rooms`.
  final String path;

  /// The module key, such as `room-bookings`.
  final String module;

  /// What one unit is called: "room", "ticket", "person", "item".
  final String unit;
}
