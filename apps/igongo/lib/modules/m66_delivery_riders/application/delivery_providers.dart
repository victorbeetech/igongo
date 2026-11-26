// Live rider data for the rider home screen (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/delivery_api.dart';
import '../domain/rider_shift.dart';

/// The rider API on the app's client.
final deliveryApiProvider = Provider((ref) => DeliveryApi(ref.watch(apiClientProvider)));

/// My shift; reloads when the session changes.
final myShiftProvider = FutureProvider.autoDispose<RiderShift>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(deliveryApiProvider).myShift();
});
