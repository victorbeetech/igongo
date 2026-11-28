// One booking, as the API returns it (packages/bookings-kit).

import '../../api/api_client.dart';

/// A booking (stay, ticket, pass, event request or shop reservation).
class Booking {
  /// Creates a booking.
  const Booking({
    required this.id,
    required this.code,
    required this.qr,
    required this.offeringName,
    required this.units,
    required this.total,
    required this.paid,
    required this.status,
    this.date,
    this.endDate,
    this.slot,
    this.unit,
  });

  /// Reads one from the API's JSON.
  factory Booking.fromJson(Json json) => Booking(
    id: '${json['id']}',
    code: '${json['code']}',
    qr: '${json['qr']}',
    offeringName: '${json['offeringName']}',
    units: (json['units'] as num?)?.toInt() ?? 1,
    total: (json['total'] as num?)?.toInt() ?? 0,
    paid: (json['paid'] as num?)?.toInt() ?? 0,
    status: '${json['status']}',
    date: json['date'] as String?,
    endDate: json['endDate'] as String?,
    slot: json['slot'] as String?,
    unit: json['unit'] as String?,
  );

  /// The booking's ID.
  final String id;

  /// The code on the ticket, such as `RB-7KQ2MX`.
  final String code;

  /// The text in the ticket's QR code.
  final String qr;

  /// What was booked.
  final String offeringName;

  /// Rooms, people or items.
  final int units;

  /// The price, whole shillings.
  final int total;

  /// Paid so far.
  final int paid;

  /// `requested`, `awaiting_payment`, `confirmed`, `checked_in` or `cancelled`.
  final String status;

  /// The day (or check-in day).
  final String? date;

  /// The check-out day, for stays.
  final String? endDate;

  /// The time slot.
  final String? slot;

  /// The room or cottage number, once staff assign one (null until then).
  final String? unit;

  /// What is still owed now (nothing for requests or cancelled bookings).
  int get owed => status == 'requested' || status == 'cancelled' ? 0 : total - paid;

  /// When it is for, in words.
  String get when =>
      [date, if (endDate != null) 'to $endDate', if (slot != null) 'at $slot'].whereType<String>().join(' ');
}
