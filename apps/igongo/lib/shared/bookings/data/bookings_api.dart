// The booking endpoints every booking module has (packages/bookings-kit), as typed calls.

import '../../api/api_client.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/offering.dart';
import '../domain/ticket_scan.dart';

/// Calls one booking module's API.
class BookingsApi {
  /// Creates the calls on [_api] for [place].
  const BookingsApi(this._api, this.place);

  final ApiClient _api;

  /// The module.
  final BookingPlace place;

  /// What is on sale.
  Future<List<Offering>> offerings() async {
    final json = await _api.get('${place.path}/offerings');
    return [for (final o in json['items'] as List<dynamic>) Offering.fromJson(o as Json)];
  }

  /// My bookings, newest first.
  Future<List<Booking>> mine() async {
    final json = await _api.get('${place.path}/bookings/mine');
    return [for (final b in json['items'] as List<dynamic>) Booking.fromJson(b as Json)];
  }

  /// Books [units] of [offeringId] at the given dates or slot.
  Future<Booking> book({
    required String offeringId,
    required int units,
    String? date,
    String? endDate,
    String? slot,
  }) async => Booking.fromJson(
    await _api.post('${place.path}/bookings', {
      'offeringId': offeringId,
      'units': units,
      'date': ?date,
      'endDate': ?endDate,
      'slot': ?slot,
    }),
  );

  /// Cancels my booking [id].
  Future<void> cancel(String id) =>
      _api.post('${place.path}/bookings/$id/cancel', {'reason': 'Cancelled by the guest'});

  /// Staff: every booking, optionally on [date] (yyyy-mm-dd) or with [status].
  Future<List<Booking>> desk({String? date, String? status}) async {
    final query = [if (date != null) 'date=$date', if (status != null) 'status=$status'].join('&');
    final json = await _api.get('${place.path}/bookings${query.isEmpty ? '' : '?$query'}');
    return [for (final b in json['items'] as List<dynamic>) Booking.fromJson(b as Json)];
  }

  /// Staff: approves a requested booking.
  Future<Booking> approve(String id) async =>
      Booking.fromJson(await _api.post('${place.path}/bookings/$id/approve', const <String, dynamic>{}));

  /// Staff: scans the [ticket] text (the QR text, or the code) and returns the server's verdict.
  Future<TicketScan> verifyTicket(String ticket) async {
    // Step 1: ask the server for the verdict.
    final json = await _api.post('${place.path}/tickets/verify', {'ticket': ticket});
    // Step 2: the booking is only present when the signature matched.
    final raw = json['booking'];
    return TicketScan(verdict: json['verdict'] as String, booking: raw == null ? null : Booking.fromJson(raw as Json));
  }

  /// Staff: checks in a [ticket] the server has verified as valid; the server refuses any other.
  Future<Booking> checkInTicket(String ticket) async =>
      Booking.fromJson(await _api.post('${place.path}/tickets/check-in', {'ticket': ticket}));
}
