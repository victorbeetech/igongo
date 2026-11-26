// One line of a record's history, as the API sends it.

import '../../api/api_client.dart';

/// One history line.
class RecordEvent {
  /// Creates a history line.
  const RecordEvent({required this.id, required this.kind, required this.text, required this.byName, required this.at});

  /// Reads one from the API's JSON.
  factory RecordEvent.fromJson(Json json) => RecordEvent(
    id: '${json['id']}',
    kind: '${json['kind']}',
    text: '${json['text']}',
    byName: '${json['byName']}',
    at: DateTime.parse('${json['at']}'),
  );

  /// The line's ID.
  final String id;

  /// created, status, comment, assigned or edited.
  final String kind;

  /// What happened.
  final String text;

  /// Who did it.
  final String byName;

  /// When.
  final DateTime at;
}
