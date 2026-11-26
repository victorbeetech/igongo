// A checkup checklist built by the super admin or an HOD.

import '../../../shared/api/api_client.dart';
import 'checklist_item.dart';

/// A checklist.
class Checklist {
  /// Creates a checklist.
  const Checklist({
    required this.id,
    required this.name,
    required this.department,
    required this.frequency,
    required this.dueBy,
    required this.items,
  });

  /// Reads one from the API's JSON.
  factory Checklist.fromJson(Json json) => Checklist(
    id: '${json['id']}',
    name: '${json['name']}',
    department: '${json['department']}',
    frequency: '${json['frequency']}',
    dueBy: '${json['dueBy']}',
    items: [for (final i in (json['items'] as List?) ?? const []) ChecklistItem.fromJson(i as Json)],
  );

  /// The checklist's ID.
  final String id;

  /// Its name.
  final String name;

  /// The department it is for.
  final String department;

  /// `daily` or `weekly`.
  final String frequency;

  /// The time it should be done by, such as `10:00`.
  final String dueBy;

  /// The lines.
  final List<ChecklistItem> items;
}
