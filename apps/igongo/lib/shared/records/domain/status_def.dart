// One step of a record type's workflow, as the API's records kit sends it.

import '../../api/api_client.dart';

/// One status.
class StatusDef {
  /// Creates a status.
  const StatusDef({required this.key, required this.label, this.done = false, this.approval = false});

  /// Reads one from the API's JSON.
  factory StatusDef.fromJson(Json json) => StatusDef(
    key: '${json['key']}',
    label: '${json['label']}',
    done: json['done'] == true,
    approval: json['approval'] == true,
  );

  /// The saved key.
  final String key;

  /// The words people see.
  final String label;

  /// Moving here closes the record.
  final bool done;

  /// Only approvers may move a record here.
  final bool approval;
}
