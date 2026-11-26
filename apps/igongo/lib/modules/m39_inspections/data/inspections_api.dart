// The Inspections endpoints the app uses (`/api/inspections`).

import '../../../shared/api/api_client.dart';
import '../domain/check_answer.dart';
import '../domain/due_checkup.dart';

/// Calls the Inspections API.
class InspectionsApi {
  /// Creates the calls on [_api].
  const InspectionsApi(this._api);

  final ApiClient _api;

  /// What I should check today (S39-01).
  Future<List<DueCheckup>> today() async {
    final json = await _api.get('/api/inspections/today');
    return [for (final d in json['items'] as List) DueCheckup.fromJson(d as Json)];
  }

  /// Submits a done checkup (S39-02); returns its score.
  Future<int> submit(String checklistId, List<CheckAnswer> answers, String? note) async {
    final run = await _api.post('/api/inspections/runs', {
      'checklistId': checklistId,
      'answers': [for (final a in answers) a.toJson()],
      'note': note,
    });
    return (run['score'] as num?)?.toInt() ?? 0;
  }
}
