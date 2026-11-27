// The guest's cart while choosing food: one outlet at a time; changing
// outlet empties it. It is kept on the server for a signed-in guest, so it
// survives an app restart; every change is saved. Signed out, it is only
// in memory, and it is emptied after an order.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session.dart';
import '../../../shared/session/session_controller.dart';
import '../data/cart_api.dart';
import '../domain/cart.dart';
import '../domain/cart_line.dart';

// Screens that name the cart type import it through this file.
export '../domain/cart.dart';

/// The saved-cart calls on the app's client.
final cartApiProvider = Provider<CartApi>((ref) => CartApi(ref.watch(apiClientProvider)));

/// Changes the cart.
class CartController extends Notifier<Cart> {
  /// True once this session's saved cart has been loaded. Saves wait for it,
  /// so an empty cart never overwrites the saved one before it arrives.
  bool _synced = false;

  @override
  Cart build() {
    // Step 1: follow sign-in and sign-out (a new session loads its saved cart).
    ref.listen<AsyncValue<Session?>>(sessionProvider, (_, next) => _onSession(next.valueOrNull));
    // Step 2: the session may already be known when the cart is first read.
    _onSession(ref.read(sessionProvider).valueOrNull);
    return (outlet: null, lines: const []);
  }

  /// Signed in: load the saved cart. Signed out: empty the cart and stop saving.
  void _onSession(Session? session) {
    _synced = false;
    if (session == null) {
      state = (outlet: null, lines: const []);
      return;
    }
    unawaited(_load());
  }

  /// Loads the saved cart. Picks made before it arrived are kept (and saved) instead of an empty reply.
  Future<void> _load() async {
    try {
      final saved = await ref.read(cartApiProvider).load();
      if (state.lines.isEmpty) state = saved;
    } catch (_) {
      // Offline or the server is busy: the cart stays as it is and saves on the next change.
    }
    _synced = true;
    _persist();
  }

  /// Saves the whole cart to the server, once the saved cart is loaded and only while signed in.
  void _persist() {
    if (!_synced || ref.read(sessionProvider).valueOrNull == null) return;
    unawaited(_save());
  }

  /// Sends the current cart to the server. A failed save is ignored here: the next change saves the whole cart again.
  Future<void> _save() async {
    try {
      await ref.read(cartApiProvider).save(state);
    } catch (_) {
      // Offline or the server is busy: nothing to show here; the next change saves again.
    }
  }

  /// Sets the cart to [next] and saves it.
  void _set(Cart next) {
    state = next;
    _persist();
  }

  /// Picks [outlet]; a different outlet empties the cart.
  void useOutlet(String outlet) {
    if (state.outlet != outlet) _set((outlet: outlet, lines: const []));
  }

  /// Adds [line].
  void add(CartLine line) => _set((outlet: state.outlet, lines: [...state.lines, line]));

  /// Sets line [index] to [quantity], never below one (the +/- buttons).
  void setQuantity(int index, int quantity) {
    final lines = [...state.lines];
    lines[index] = lines[index].withQuantity(quantity < 1 ? 1 : quantity);
    _set((outlet: state.outlet, lines: lines));
  }

  /// Sets the day of line [index] to [day] (the date picker).
  void setDate(int index, DateTime day) {
    final lines = [...state.lines];
    lines[index] = lines[index].withDate(day);
    _set((outlet: state.outlet, lines: lines));
  }

  /// Removes line number [index].
  void removeAt(int index) => _set((outlet: state.outlet, lines: [...state.lines]..removeAt(index)));

  /// Fills the cart with [lines] from [outlet] (order again).
  void refill(String outlet, List<CartLine> lines) => _set((outlet: outlet, lines: lines));

  /// Empties the cart after an order.
  void clear() => _set((outlet: state.outlet, lines: const []));
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

/// The menu section chosen in the food shop's chips (null shows every section).
class MenuCategory extends Notifier<String?> {
  @override
  String? build() => null;

  /// Chooses [section]; null means all.
  void set(String? section) => state = section;
}

/// The food shop's chosen section.
final menuCategoryProvider = NotifierProvider<MenuCategory, String?>(MenuCategory.new);

/// The delivery zone and place of the guest's last delivery, to fill in next time
/// (the guest still confirms it each time). Kept in memory only.
class LastDelivery extends Notifier<({String? zone, String place})> {
  @override
  ({String? zone, String place}) build() => (zone: null, place: '');

  /// Remembers [zone] and [place].
  void set(String? zone, String place) => state = (zone: zone, place: place);
}

/// The last delivery location.
final lastDeliveryProvider = NotifierProvider<LastDelivery, ({String? zone, String place})>(LastDelivery.new);
