// One delivery on the guest's tracker (S66-10), whatever it is: food, shop
// items, laundry, a room service tray or a parcel. The API builds it from
// the delivery job and the rider's last position.

import '../../../shared/api/api_client.dart';

/// One step of the tracker: waiting, assigned, picked up, delivered.
typedef TrackStep = ({String step, bool done, String? at});

/// A delivery as the guest follows it.
class TrackedDelivery {
  /// Creates the delivery.
  const TrackedDelivery({
    required this.jobId,
    required this.source,
    required this.reference,
    required this.status,
    required this.place,
    required this.steps,
    required this.code,
    required this.cashToCollect,
    this.what,
    this.riderName,
    this.eta,
    this.riderLat,
    this.riderLng,
    this.failReason,
  });

  /// Reads one from the API's JSON.
  factory TrackedDelivery.fromJson(Json json) {
    final rider = json['rider'] as Json?;
    return TrackedDelivery(
      jobId: '${json['jobId']}',
      source: '${json['source']}',
      reference: '${json['reference']}',
      status: '${json['status']}',
      place: '${json['place']}',
      steps: [
        for (final s in json['steps'] as List<dynamic>? ?? const [])
          (step: '${(s as Json)['step']}', done: s['done'] == true, at: s['at'] as String?),
      ],
      code: '${json['code']}',
      cashToCollect: (json['cashToCollect'] as num?)?.toInt() ?? 0,
      what: json['what'] as String?,
      riderName: json['riderName'] as String?,
      eta: json['eta'] as String?,
      riderLat: (rider?['lat'] as num?)?.toDouble(),
      riderLng: (rider?['lng'] as num?)?.toDouble(),
      failReason: json['failReason'] as String?,
    );
  }

  /// The delivery job's ID.
  final String jobId;

  /// `food`, `shop`, `laundry`, `room_service` or `parcel`.
  final String source;

  /// The number to quote, such as `F-0042` or `D-0007`.
  final String reference;

  /// `waiting`, `assigned`, `accepted`, `picked_up`, `delivered` or `failed`.
  final String status;

  /// Where it goes.
  final String place;

  /// The tracker's steps, in order.
  final List<TrackStep> steps;

  /// The 4-digit code to give the rider at the door.
  final String code;

  /// Cash the rider will ask for at the door.
  final int cashToCollect;

  /// What the rider carries (null for food: the order lists it).
  final String? what;

  /// The rider, once assigned.
  final String? riderName;

  /// When it should arrive (ISO time).
  final String? eta;

  /// The rider's last position, only while on the road.
  final double? riderLat;

  /// The rider's last position, only while on the road.
  final double? riderLng;

  /// Why it could not be delivered.
  final String? failReason;

  /// True until it is delivered or failed.
  bool get active => status != 'delivered' && status != 'failed';
}

/// Words for each kind of delivery.
String sourceWords(String source) => switch (source) {
  'food' => 'Food',
  'shop' => 'Shop items',
  'laundry' => 'Laundry',
  'room_service' => 'Room service',
  _ => 'Parcel',
};

/// Words for each tracker step.
String stepWords(String step) => switch (step) {
  'waiting' => 'Getting ready',
  'assigned' => 'Rider assigned',
  'picked_up' => 'On the way',
  _ => 'Delivered',
};
