// Something a booking module sells (a room type, ticket, pass, event or
// shop item), as the API returns it (packages/bookings-kit).

import '../../api/api_client.dart';

/// One offering.
class Offering {
  /// Creates an offering.
  const Offering({
    required this.id,
    required this.kind,
    required this.name,
    required this.price,
    required this.capacity,
    required this.slots,
    this.description,
    this.onDate,
    this.details = const {},
  });

  /// Reads one from the API's JSON.
  factory Offering.fromJson(Json json) => Offering(
    id: '${json['id']}',
    kind: '${json['kind']}',
    name: '${json['name']}',
    price: (json['price'] as num?)?.toInt() ?? 0,
    capacity: (json['capacity'] as num?)?.toInt() ?? 0,
    slots: [for (final s in json['slots'] as List<dynamic>? ?? const []) '$s'],
    description: json['description'] as String?,
    onDate: json['onDate'] as String?,
    details: {for (final e in (json['details'] as Map<String, dynamic>? ?? const {}).entries) e.key: '${e.value}'},
  );

  /// The offering's ID.
  final String id;

  /// How it is booked: `nights`, `slot`, `stock` or `enquiry`.
  final String kind;

  /// Its name for people.
  final String name;

  /// Whole shillings per unit (per night for rooms).
  final int price;

  /// Rooms, places per slot, or items in stock.
  final int capacity;

  /// Time slots, `HH:MM`; empty means all day.
  final List<String> slots;

  /// More about it.
  final String? description;

  /// A fixed date (an event), or null for any day.
  final String? onDate;

  /// Extra facts from the admin, such as a visitor type (`visitor`: adult, resident or child).
  final Map<String, String> details;
}
