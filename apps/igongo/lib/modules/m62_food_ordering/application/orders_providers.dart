// Live food data for the ordering screens (Riverpod). Each reloads when the
// session changes.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/orders_api.dart';
import '../demo/demo_menu.dart';
import '../demo/demo_orders.dart';
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
// The demo outlet shows only while the server has no outlets (see demo/demo_menu.dart).
final outletsProvider = FutureProvider.autoDispose<List<Outlet>>((ref) async {
  ref.watch(sessionProvider);
  final live = await ref.watch(ordersApiProvider).outlets();
  return live.isEmpty && demoMenuOn ? demoOutlets : live;
});

/// One outlet's menu.
final menuProvider = FutureProvider.autoDispose.family<List<MenuItem>, String>((ref, outlet) async {
  ref.watch(sessionProvider);
  if (isDemoOutlet(outlet)) return demoMenuItems;
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
// Demo orders (demo/demo_orders.dart) are listed first while the demo is on.
final myOrdersProvider = FutureProvider.autoDispose<List<Order>>((ref) async {
  ref.watch(sessionProvider);
  final demo = demoMenuOn ? ref.watch(demoOrdersProvider) : const <Order>[];
  return [...demo, ...await ref.watch(ordersApiProvider).mine()];
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
