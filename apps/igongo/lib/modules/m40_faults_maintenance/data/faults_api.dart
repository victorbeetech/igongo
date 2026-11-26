// The Faults & Maintenance endpoints the app uses (`/api/faults`).

import '../../../shared/api/api_client.dart';
import '../domain/fault.dart';
import '../domain/fault_page.dart';

/// Calls the Faults API.
class FaultsApi {
  /// Creates the calls on [_api].
  const FaultsApi(this._api);

  final ApiClient _api;

  /// Faults I reported, or (with [assigned]) faults given to me to fix.
  Future<List<Fault>> mine({bool assigned = false}) async {
    final json = await _api.get('/api/faults?limit=100&mine=${assigned ? 'assigned' : 'reported'}');
    return [for (final f in json['items'] as List) Fault.fromJson(f as Json)];
  }

  /// One fault (S40-04).
  Future<FaultPage> fault(String id) async => FaultPage.fromJson(await _api.get('/api/faults/$id'));

  /// Reports a fault (S40-01) and returns it.
  Future<Fault> report({
    required String title,
    required String description,
    required String? location,
    required String priority,
    required List<String> photoIds,
  }) async => Fault.fromJson(
    await _api.post('/api/faults', {
      'title': title,
      'description': description,
      'location': location,
      'priority': priority,
      'photoIds': photoIds,
    }),
  );

  /// Moves a fault along (start, fix, close, reopen); the API checks who may.
  Future<void> move(String id, String status, String? note) =>
      _api.post('/api/faults/$id/status', {'status': status, 'note': note});

  /// Likes or unlikes.
  Future<void> toggleLike(String id) => _api.post('/api/faults/$id/like');

  /// Comments.
  Future<void> comment(String id, String body) => _api.post('/api/faults/$id/comments', {'body': body});
}
