// One way to pay that the super admin has switched on (S77-06), as the
// Payments API lists it for a module and outlet.

import '../../api/api_client.dart';

/// A payment method on offer.
class PayMethod {
  /// Creates a method.
  const PayMethod({required this.method, required this.name, required this.kind});

  /// Reads one from the API's JSON.
  factory PayMethod.fromJson(Json json) =>
      PayMethod(method: '${json['method']}', name: '${json['name']}', kind: '${json['kind']}');

  /// The method key, such as `mtn_momo`.
  final String method;

  /// Its name for people, such as "MTN Mobile Money".
  final String name;

  /// `prompt` (a phone approval), `redirect` (a card page) or `staff` (paid at the desk).
  final String kind;

  /// True when the guest must type a phone number.
  bool get needsPhone => kind == 'prompt';
}
