// One room (or timed slot) on one day of the booking calendar, as the API
// sends it: its name and how many units are left. Never a guest's name.

import '../../../shared/api/api_client.dart';

/// A room on one day, with the units still free.
class CalendarRoom {
  /// Creates a room line.
  const CalendarRoom({required this.offeringId, required this.name, required this.left});

  /// Reads one room from the API's JSON. A missing or null `left` means there is no limit.
  factory CalendarRoom.fromJson(Json json) => CalendarRoom(
    offeringId: '${json['offeringId']}',
    name: '${json['name']}',
    left: (json['left'] as num?)?.toInt(),
  );

  /// The room's id on the server.
  final String offeringId;

  /// The room's name, such as "Garden Room".
  final String name;

  /// Units still free on the day, or null when there is no limit.
  final int? left;
}
