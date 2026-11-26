// Live payment data for the pay sheet (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/payments_api.dart';
import '../domain/pay_method.dart';

/// The Payments API on the app's client.
final paymentsApiProvider = Provider((ref) => PaymentsApi(ref.watch(apiClientProvider)));

/// Which bill a pay sheet is for: the module and, for food, the outlet.
typedef PayPlace = ({String module, String? outlet});

/// The methods on offer for a [PayPlace].
final payMethodsProvider = FutureProvider.autoDispose.family<List<PayMethod>, PayPlace>((ref, place) {
  ref.watch(sessionProvider);
  return ref.watch(paymentsApiProvider).methods(place.module, outlet: place.outlet);
});
