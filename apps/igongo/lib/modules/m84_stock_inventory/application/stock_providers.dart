// Live stock data for the app's stock screens (Riverpod); reloads when the session changes.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/stock_api.dart';
import '../domain/stock_item.dart';
import '../domain/stock_store.dart';

/// The stock API.
final stockApiProvider = Provider<StockApi>((ref) => StockApi(ref.watch(apiClientProvider)));

/// The stores.
final stockStoresProvider = FutureProvider.autoDispose<List<StockStore>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(stockApiProvider).stores();
});

/// The items (true: only low ones).
final stockItemsProvider = FutureProvider.autoDispose.family<List<StockItem>, bool>((ref, lowOnly) {
  ref.watch(sessionProvider);
  return ref.watch(stockApiProvider).items(lowOnly: lowOnly);
});
