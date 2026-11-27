// The server's price for the cart on screen, for the summary. The app asks
// the server; it never works out a price itself. Delivery needs an address
// and pre-order needs a time, so the quote uses the first on-site order type
// the outlet takes.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/cart_quote.dart';
import '../domain/ordering_rules.dart';
import 'cart_controller.dart';
import 'orders_providers.dart';

/// On-site order types that need no address or time, in the order to try them.
const _quoteTypes = ['room_service', 'dine_in', 'takeaway'];

/// The first of [_quoteTypes] that [outlet] takes, or null when none is on.
String? quoteTypeAt(OrderingRules rules, String outlet) {
  // Step 1: the types this outlet takes right now.
  final on = rules.typesAt(outlet);
  // Step 2: the first one we can quote without an address or time.
  for (final type in _quoteTypes) {
    if (on.contains(type)) return type;
  }
  return null;
}

/// The server's price for the cart; null when the cart is empty or no quote type is on.
final cartQuoteProvider = FutureProvider.autoDispose<CartQuote?>((ref) async {
  // Step 1: the cart as it is now. An empty cart has nothing to price.
  final cart = ref.watch(cartProvider);
  final outlet = cart.outlet;
  if (cart.lines.isEmpty || outlet == null) return null;
  // Step 2: pick the order type from the rules the super admin set.
  final rules = await ref.watch(orderingRulesProvider.future);
  final type = quoteTypeAt(rules, outlet);
  if (type == null) return null;
  // Step 3: ask the server to price the cart.
  return ref.watch(ordersApiProvider).quote({
    'outlet': outlet,
    'type': type,
    'lines': [for (final l in cart.lines) l.toJson()],
  });
});
