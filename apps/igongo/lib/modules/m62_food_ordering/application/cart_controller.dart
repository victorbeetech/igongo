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

  /// Removes line number [index].
  void removeAt(int index) => state = (outlet: state.outlet, lines: [...state.lines]..removeAt(index));

  /// Fills the cart with [lines] from [outlet] (order again).
  void refill(String outlet, List<CartLine> lines) => state = (outlet: outlet, lines: lines);

  /// Empties the cart after an order.
  void clear() => state = (outlet: state.outlet, lines: const []);
}

/// The cart, kept while the app runs.
final cartProvider = NotifierProvider<CartController, Cart>(CartController.new);

/// What the guest typed in the food shop's search box (empty shows every dish).
class MenuSearch extends Notifier<String> {
  @override
  String build() => '';

  /// Sets the search text to [text].
  void set(String text) => state = text;
}

/// The food shop's search text.
final menuSearchProvider = NotifierProvider<MenuSearch, String>(MenuSearch.new);

/// The menu section chosen in the food shop's chips (null shows every section).
class MenuCategory extends Notifier<String?> {
  @override
  String? build() => null;

  /// Chooses [section]; null means all.
  void set(String? section) => state = section;
}

/// The food shop's chosen section.
final menuCategoryProvider = NotifierProvider<MenuCategory, String?>(MenuCategory.new);
