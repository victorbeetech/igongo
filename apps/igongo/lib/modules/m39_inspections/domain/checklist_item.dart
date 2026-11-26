// One line of a checkup checklist.

import '../../../shared/api/api_client.dart';

/// A line to check.
class ChecklistItem {
  /// Creates a line.
  const ChecklistItem({required this.key, required this.label, required this.photoOnFail, required this.raiseFault});

  /// Reads one from the API's JSON.
  factory ChecklistItem.fromJson(Json json) => ChecklistItem(
    key: '${json['key']}',
    label: '${json['label']}',
    photoOnFail: json['photoOnFail'] == true,
    raiseFault: json['raiseFault'] != false,
  );

  /// The line's key.
  final String key;

  /// What to check.
  final String label;

  /// Ask for a photo when it fails.
  final bool photoOnFail;

  /// A failure opens a fault report.
  final bool raiseFault;
}
