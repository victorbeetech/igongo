// The saved-cart endpoints (`/api/orders/cart`): the guest's own cart, kept
// on the server so it survives an app restart. Each call acts only on the
// signed-in guest's cart.

import '../../../shared/api/api_client.dart';
import '../domain/cart.dart';
import '../domain/cart_line.dart';

/// Reads, saves and clears the guest's saved cart.
class CartApi {
  /// Creates the calls on [_api].
  const CartApi(this._api);

  final ApiClient _api;

  /// The guest's saved cart (empty when none is saved).
  Future<Cart> load() async {
    final json = await _api.get('/api/orders/cart');
    return (
      outlet: json['outlet'] as String?,
      lines: [for (final l in json['lines'] as List<dynamic>? ?? const []) CartLine.fromJson(l as Json)],
    );
  }

  /// Replaces the saved cart with [cart] (the whole cart each time, so it is always exact).
  Future<void> save(Cart cart) => _api.put('/api/orders/cart', {
    'outlet': cart.lines.isEmpty ? null : cart.outlet,
    'lines': [for (final l in cart.lines) l.toSavedJson()],
  });

  /// Empties the saved cart.
  Future<void> clear() => _api.send('DELETE', '/api/orders/cart');
}
