// The Stock & Inventory endpoints the app uses (modules/stock-inventory), as typed calls.

import '../../../shared/api/api_client.dart';
import '../domain/move_kind.dart';
import '../domain/stock_item.dart';
import '../domain/stock_store.dart';

/// Calls the stock API.
class StockApi {
  /// Creates the calls on [_api].
  const StockApi(this._api);

  final ApiClient _api;

  /// The stores, with the ones I may work in marked.
  Future<List<StockStore>> stores() async => [
    for (final s in (await _api.get('/api/stock/stores'))['items'] as List<dynamic>) StockStore.fromJson(s as Json),
  ];

  /// The items with stock on hand, or only the low ones.
  Future<List<StockItem>> items({bool lowOnly = false}) async => [
    for (final i in (await _api.get(lowOnly ? '/api/stock/low' : '/api/stock/items'))['items'] as List<dynamic>)
      StockItem.fromJson(i as Json),
  ];

  /// Posts one movement of [qty] base units of [itemId].
  Future<void> move(
    MoveKind kind, {
    required String itemId,
    required double qty,
    String? fromStoreId,
    String? toStoreId,
    String? reference,
    String? note,
  }) => _api.post('/api/stock/movements', {
    'kind': kind.name,
    'itemId': itemId,
    'qty': qty,
    'fromStoreId': ?fromStoreId,
    'toStoreId': ?toStoreId,
    'reference': ?reference,
    if (kind == MoveKind.issue) 'issuedTo': ?reference,
    'note': ?note,
  });

  /// Saves a count of [itemId] in [storeId]; the ledger books the difference.
  Future<void> count({required String itemId, required String storeId, required double counted, String? note}) =>
      _api.post('/api/stock/counts', {'itemId': itemId, 'storeId': storeId, 'counted': counted, 'note': ?note});
}
