// A store (main store, kitchen, housekeeping), as the stock API returns it.

import '../../../shared/api/api_client.dart';

/// One store.
class StockStore {
  /// Creates a store.
  const StockStore({required this.id, required this.name, required this.active, required this.mine});

  /// Reads a store from the API.
  factory StockStore.fromJson(Json j) => StockStore(
    id: j['id'] as String,
    name: j['name'] as String,
    active: j['active'] as bool? ?? true,
    mine: j['mine'] as bool? ?? false,
  );

  /// The store's ID.
  final String id;

  /// Its name.
  final String name;

  /// False when closed.
  final bool active;

  /// True when the signed-in person may move stock in or out of it.
  final bool mine;
}
