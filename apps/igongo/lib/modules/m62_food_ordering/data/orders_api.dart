// The food endpoints the app uses: menus (`/api/menu`), delivery zones and
// tracking (`/api/delivery`) and orders (`/api/orders`).

import '../../../shared/api/api_client.dart';
import '../domain/delivery_track.dart';
import '../domain/delivery_zone.dart';
import '../domain/menu_item.dart';
import '../domain/order.dart';
import '../domain/ordering_rules.dart';
import '../domain/outlet.dart';

/// Calls the food APIs.
class OrdersApi {
  /// Creates the calls on [_api].
  const OrdersApi(this._api);

  final ApiClient _api;

  /// Reads `items` of [json] with [make].
  static List<T> _items<T>(Json json, T Function(Json) make) => [
    for (final i in json['items'] as List<dynamic>) make(i as Json),
  ];

  /// Outlets guests may order from.
  Future<List<Outlet>> outlets() async => _items(await _api.get('/api/menu/outlets'), Outlet.fromJson);

  /// [outlet]'s menu.
  Future<List<MenuItem>> menu(String outlet) async =>
      _items(await _api.get('/api/menu/items?outlet=$outlet'), MenuItem.fromJson);

  /// The ordering rules.
  Future<OrderingRules> rules() async => OrderingRules.fromJson(await _api.get('/api/orders/rules'));

  /// Delivery zones.
  Future<List<DeliveryZone>> zones() async => _items(await _api.get('/api/delivery/zones'), DeliveryZone.fromJson);

  /// Places an order; [body] is the cart and details as the API takes them.
  Future<Order> place(Json body) async => Order.fromJson(await _api.post('/api/orders', body));

  /// My orders, newest first.
  Future<List<Order>> mine() async => _items(await _api.get('/api/orders/mine'), Order.fromJson);

  /// Cancels my order [id].
  Future<void> cancel(String id) => _api.post('/api/orders/$id/cancel', {'reason': 'Cancelled by the guest'});

  /// Where my delivery for order [orderId] is.
  Future<DeliveryTrack> track(String orderId) async =>
      DeliveryTrack.fromJson(await _api.get('/api/delivery/track/$orderId'));
}
