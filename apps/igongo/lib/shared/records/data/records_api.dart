// The endpoints every records-kit module has (packages/records-kit), as typed calls.

import '../../api/api_client.dart';
import '../domain/record_config.dart';
import '../domain/record_event.dart';
import '../domain/record_place.dart';
import '../domain/record_query.dart';
import '../domain/work_record.dart';

/// Calls one records module's API.
class RecordsApi {
  /// Creates the calls on [_api].
  const RecordsApi(this._api);

  final ApiClient _api;

  /// The module's set-up.
  Future<RecordConfig> config(RecordPlace place) async => RecordConfig.fromJson(await _api.get('${place.path}/config'));

  /// A list of records.
  Future<List<WorkRecord>> list(RecordQuery q) async {
    final json = await _api.get('${q.path}/records${q.search.isEmpty ? '' : '?${q.search}'}');
    return [for (final r in json['items'] as List<dynamic>) WorkRecord.fromJson(r as Json)];
  }

  /// One record and its history.
  Future<(WorkRecord, List<RecordEvent>)> one(RecordPlace place, String id) async {
    final json = await _api.get('${place.path}/records/$id');
    return (
      WorkRecord.fromJson(json['record'] as Json),
      [for (final e in json['events'] as List<dynamic>) RecordEvent.fromJson(e as Json)],
    );
  }

  /// Adds a [type] record with [fields].
  Future<WorkRecord> create(
    RecordPlace place, {
    required String type,
    required Json fields,
    String? dueOn,
    String? location,
  }) async => WorkRecord.fromJson(
    await _api.post('${place.path}/records', {'type': type, 'fields': fields, 'dueOn': ?dueOn, 'location': ?location}),
  );

  /// Moves record [id] to [status].
  Future<void> move(RecordPlace place, String id, String status) =>
      _api.post('${place.path}/records/$id/status', {'status': status});

  /// Comments on record [id].
  Future<void> comment(RecordPlace place, String id, String text) =>
      _api.post('${place.path}/records/$id/comments', {'text': text});

  /// Finds a record by its code or QR text.
  Future<WorkRecord> lookup(RecordPlace place, String code) async =>
      WorkRecord.fromJson(await _api.get('${place.path}/lookup/${Uri.encodeComponent(code)}'));
}
