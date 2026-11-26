// The staff orders board's data: open orders (optionally one status) and
// moving an order to its next step. The server checks the person's role.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../session/session_controller.dart';
import 'board_order.dart';

/// Open orders with [status] (null for every status), newest last.
final boardOrdersProvider = FutureProvider.autoDispose.family<List<BoardOrder>, String?>((ref, status) async {
  ref.watch(sessionProvider);
  final json = await ref.watch(apiClientProvider).get('/api/orders/board${status == null ? '' : '?status=$status'}');
  return [for (final o in json['items'] as List<dynamic>) BoardOrder.fromJson(o as Json)];
});

/// Moves order [id] to [status] (preparing, ready or delivered).
Future<void> moveOrder(ApiClient api, String id, String status) =>
    api.post('/api/orders/$id/status', {'status': status});
