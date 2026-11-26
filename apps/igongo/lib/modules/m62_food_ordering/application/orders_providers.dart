// Live food data for the ordering screens (Riverpod). Each reloads when the
// session changes.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/orders_api.dart';
import '../domain/delivery_track.dart';
import '../domain/delivery_zone.dart';
import '../domain/item_stars.dart';
import '../domain/menu_item.dart';
import '../domain/order.dart';
import '../domain/ordering_rules.dart';
import '../domain/outlet.dart';

/// The food APIs on the app's client.
final ordersApiProvider = Provider((ref) => OrdersApi(ref.watch(apiClientProvider)));

/// Outlets guests may order from.
final outletsProvider = FutureProvider.autoDispose<List<Outlet>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).outlets();
});

/// One outlet's menu.
final menuProvider = FutureProvider.autoDispose.family<List<MenuItem>, String>((ref, outlet) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).menu(outlet);
});

/// The ordering rules.
final orderingRulesProvider = FutureProvider.autoDispose<OrderingRules>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).rules();
});

/// Delivery zones.
final zonesProvider = FutureProvider.autoDispose<List<DeliveryZone>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).zones();
});

/// My orders.
final myOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).mine();
});

/// Where the delivery of one order is.
final trackProvider = FutureProvider.autoDispose.family<DeliveryTrack, String>((ref, orderId) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).track(orderId);
});

/// Each dish's average stars, for the menu (by item ID).
final starsProvider = FutureProvider.autoDispose<Map<String, ItemStars>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(ordersApiProvider).stars();
});
