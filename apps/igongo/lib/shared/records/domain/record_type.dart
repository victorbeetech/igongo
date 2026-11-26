// A kind of record in one module (such as "Found item"), with its fields and statuses.

import '../../api/api_client.dart';
import 'field_def.dart';
import 'status_def.dart';

/// One record type.
class RecordType {
  /// Creates a type.
  const RecordType({
    required this.key,
    required this.name,
    required this.active,
    required this.selfService,
    required this.fields,
    required this.statuses,
  });

  /// Reads one from the API's JSON.
  factory RecordType.fromJson(Json json) => RecordType(
    key: '${json['key']}',
    name: '${json['name']}',
    active: json['active'] == true,
    selfService: json['selfService'] == true,
    fields: [for (final f in json['fields'] as List<dynamic>) FieldDef.fromJson(f as Json)],
    statuses: [for (final s in json['statuses'] as List<dynamic>) StatusDef.fromJson(s as Json)],
  );

  /// The saved key.
  final String key;

  /// The name people see.
  final String name;

  /// Switched-off types take no new records.
  final bool active;

  /// Ordinary staff and guests may raise it for themselves.
  final bool selfService;

  /// The form's fields.
  final List<FieldDef> fields;

  /// The workflow, in order.
  final List<StatusDef> statuses;

  /// The words of status [key].
  String statusLabel(String key) =>
      statuses.where((s) => s.key == key).map((s) => s.label).firstOrNull ?? key.replaceAll('_', ' ');
}
