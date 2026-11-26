// The booking endpoints every booking module has (packages/bookings-kit), as typed calls.

import '../../api/api_client.dart';
import '../domain/booking.dart';
import '../domain/booking_place.dart';
import '../domain/offering.dart';

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
}
