// The guest's cart while choosing food: one outlet at a time; changing
// outlet empties it. Kept in memory only (it is gone after an order).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/cart_line.dart';

/// The cart: which outlet and its lines.
typedef Cart = ({String? outlet, List<CartLine> lines});

/// Changes the cart.
class CartController extends Notifier<Cart> {
  @override
  Cart build() => (outlet: null, lines: const []);

  /// Picks [outlet]; a different outlet empties the cart.
  void useOutlet(String outlet) {
    if (state.outlet != outlet) state = (outlet: outlet, lines: const []);
  }

  /// Adds [line].
  void add(CartLine line) => state = (outlet: state.outlet, lines: [...state.lines, line]);

  /// Sets line [index] to [quantity], never below one (the +/- buttons).
  void setQuantity(int index, int quantity) {
    final lines = [...state.lines];
    lines[index] = lines[index].withQuantity(quantity < 1 ? 1 : quantity);
    state = (outlet: state.outlet, lines: lines);
  }

  /// Sets the day of line [index] to [day] (the date picker).
  void setDate(int index, DateTime day) {
    final lines = [...state.lines];
    lines[index] = lines[index].withDate(day);
    state = (outlet: state.outlet, lines: lines);
  }

  /// Removes line number [index].
  void removeAt(int index) => state = (outlet: state.outlet, lines: [...state.lines]..removeAt(index));

  /// Fills the cart with [lines] from [outlet] (order again).
  void refill(String outlet, List<CartLine> lines) => state = (outlet: outlet, lines: lines);

  /// Empties the cart after an order.
  void clear() => state = (outlet: state.outlet, lines: const []);
}

/// The cart, kept while the app runs.
final cartProvider = NotifierProvider<CartController, Cart>(CartController.new);

/// How many dishes are in the cart (the sum of every line's quantity), for badges.
final cartCountProvider = Provider<int>((ref) => ref.watch(cartProvider).lines.fold(0, (n, l) => n + l.quantity));

/// What the guest typed in the food shop's search box (empty shows every dish).
class MenuSearch extends Notifier<String> {
  @override
  String build() => '';

  /// Sets the search text to [text].
  void set(String text) => state = text;
}

/// The food shop's search text.
final menuSearchProvider = NotifierProvider<MenuSearch, String>(MenuSearch.new);
