// The food endpoints the app uses: menus (`/api/menu`), delivery zones and
// tracking (`/api/delivery`) and orders (`/api/orders`).

import '../../../shared/api/api_client.dart';
import '../../../shared/api/history_pages.dart';
import '../domain/cart_line.dart';
import '../domain/cart_quote.dart';
import '../domain/delivery_track.dart';
import '../domain/delivery_zone.dart';
import '../domain/item_stars.dart';
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

  /// The server's price for the cart [body] (with any promo code), without ordering.
  Future<CartQuote> quote(Json body) async => CartQuote.fromJson(await _api.post('/api/orders/quote', body));

  /// Each dish's average stars, for the menu.
  Future<Map<String, ItemStars>> stars() async => {
    for (final s in _items(await _api.get('/api/orders/stars'), ItemStars.fromJson)) s.itemId: s,
  };

  /// Rates my delivered order [id]: food stars, delivery stars (deliveries) and a short review.
  Future<void> rate(String id, {required int food, int? delivery, String? comment}) =>
      _api.post('/api/orders/$id/rating', {'food': food, 'delivery': ?delivery, 'comment': ?comment});

  /// My order [id] again at today's prices: the outlet, type, cart lines and dishes no longer on the menu.
  Future<({String outlet, String type, List<CartLine> lines, List<String> missing})> reorder(String id) async {
    final json = await _api.get('/api/orders/$id/reorder');
    final quote = json['quote'] as Json?;
    final lines = [for (final l in quote?['lines'] as List<dynamic>? ?? const []) _cartLineOf(l as Json)];
    return (
      outlet: '${json['outlet']}',
      type: '${json['type']}',
      lines: lines,
      missing: [for (final m in json['missing'] as List<dynamic>? ?? const []) '$m'],
    );
  }

  /// A priced order line from the API as a cart line (its options back as `group:choice` picks).
  static CartLine _cartLineOf(Json l) => CartLine(
    itemId: '${l['itemId']}',
    name: '${l['name']}',
    quantity: (l['quantity'] as num?)?.toInt() ?? 1,
    unitPrice: (l['unitPrice'] as num?)?.toInt() ?? 0,
    options: [for (final o in l['options'] as List<dynamic>? ?? const []) '${(o as Json)['group']}:${o['key']}'],
  );

  /// Places an order; [body] is the cart and details as the API takes them.
  Future<Order> place(Json body) async => Order.fromJson(await _api.post('/api/orders', body));

  /// My orders, newest first, across every page of my history.
  Future<List<Order>> mine() => readAllPages(_api, '/api/orders/mine', Order.fromJson);

  /// Cancels my order [id].
  Future<void> cancel(String id) => _api.post('/api/orders/$id/cancel', {'reason': 'Cancelled by the guest'});

  /// Where my delivery for order [orderId] is.
  Future<DeliveryTrack> track(String orderId) async =>
      DeliveryTrack.fromJson(await _api.get('/api/delivery/track/$orderId'));
}
