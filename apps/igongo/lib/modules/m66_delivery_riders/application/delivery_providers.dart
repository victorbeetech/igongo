// Live delivery data (Riverpod): the rider's shift, and the guest's tracker.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/delivery_api.dart';
import '../domain/rider_shift.dart';
import '../domain/tracked_delivery.dart';

/// The rider API on the app's client.
final deliveryApiProvider = Provider((ref) => DeliveryApi(ref.watch(apiClientProvider)));

/// My shift; reloads when the session changes.
final myShiftProvider = FutureProvider.autoDispose<RiderShift>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(deliveryApiProvider).myShift();
});

/// How often the tracker asks again while something is on its way.
const trackerRefresh = Duration(seconds: 15);

/// My deliveries of every kind; reloads when the session changes.
final myDeliveriesProvider = FutureProvider.autoDispose<({List<TrackedDelivery> active, List<TrackedDelivery> done})>((
  ref,
) {
  ref.watch(sessionProvider);
  return ref.watch(deliveryApiProvider).mine();
});
