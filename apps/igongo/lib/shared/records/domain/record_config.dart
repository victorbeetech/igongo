// A module's record set-up: its types and switches, as the super admin saved them.

import '../../api/api_client.dart';
import 'record_type.dart';

/// One module's set-up.
class RecordConfig {
  /// Creates a set-up.
  const RecordConfig({required this.types, required this.comments, required this.notice});

  /// Reads one from the API's JSON.
  factory RecordConfig.fromJson(Json json) => RecordConfig(
    types: [for (final t in json['types'] as List<dynamic>) RecordType.fromJson(t as Json)],
    comments: json['comments'] == true,
    notice: '${json['notice'] ?? ''}',
  );

  /// Every record type.
  final List<RecordType> types;

  /// Comments are on.
  final bool comments;

  /// A note for the top of the module's screens.
  final String notice;

  /// The type [key], if there is one.
  RecordType? type(String key) => types.where((t) => t.key == key).firstOrNull;

  /// The active types among [keys] (every active one when [keys] is empty).
  List<RecordType> pick(List<String> keys) {
    final active = types.where((t) => t.active).toList();
    final picked = keys.isEmpty ? active : active.where((t) => keys.contains(t.key)).toList();
    return picked.isEmpty ? active : picked;
  }
}
