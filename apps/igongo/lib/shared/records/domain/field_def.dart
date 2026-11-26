// One field of a record type, as the API's records kit sends it. The super
// admin adds and changes these; the forms are drawn from them.

import '../../api/api_client.dart';

/// One form field.
class FieldDef {
  /// Creates a field.
  const FieldDef({
    required this.key,
    required this.label,
    required this.kind,
    this.required = false,
    this.options = const [],
    this.inList = false,
  });

  /// Reads one from the API's JSON.
  factory FieldDef.fromJson(Json json) => FieldDef(
    key: '${json['key']}',
    label: '${json['label']}',
    kind: '${json['kind']}',
    required: json['required'] == true,
    options: [for (final o in (json['options'] as List<dynamic>? ?? const [])) '$o'],
    inList: json['inList'] == true,
  );

  /// The key the value is saved under.
  final String key;

  /// The label people see.
  final String label;

  /// text, longtext, number, money, date, time, select, yesno, staff, photo or phone.
  final String kind;

  /// The record cannot be saved without it.
  final bool required;

  /// The choices of a `select` field.
  final List<String> options;

  /// Shown on list cards.
  final bool inList;
}
