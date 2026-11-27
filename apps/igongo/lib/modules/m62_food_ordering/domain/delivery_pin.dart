// A delivery pin: the map point a guest chose for their delivery, with the
// words the rider reads and the zone. One model, one file; the API sends and
// reads it as JSON (see data/saved_pin_api.dart).

import '../../../shared/api/api_client.dart';

/// Where a delivery goes: a map point (latitude and longitude) plus its label and zone.
class DeliveryPin {
  /// Creates a pin.
  const DeliveryPin({required this.label, required this.zone, required this.lat, required this.lng});

  /// Reads a pin from the API's JSON.
  factory DeliveryPin.fromJson(Json json) => DeliveryPin(
    label: json['label'] as String,
    zone: json['zone'] as String?,
    lat: (json['lat'] as num).toDouble(),
    lng: (json['lng'] as num).toDouble(),
  );

  /// The words the rider reads, such as "Cottage 4".
  final String label;

  /// The delivery zone key, or null when none is chosen.
  final String? zone;

  /// Latitude in degrees.
  final double lat;

  /// Longitude in degrees.
  final double lng;

  /// The JSON the API expects when the guest saves this pin.
  Json toJson() => {'label': label, 'zone': zone, 'lat': lat, 'lng': lng};
}
