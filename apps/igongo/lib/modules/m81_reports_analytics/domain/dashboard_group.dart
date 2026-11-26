// One area's numbers on the dashboard, such as Food orders.

import '../../../shared/api/api_client.dart';
import 'kpi.dart';

/// An area's numbers; [failed] when that module could not answer.
class DashboardGroup {
  /// Creates a group.
  const DashboardGroup({required this.module, required this.title, required this.kpis, required this.failed});

  /// Reads one from the API's JSON.
  factory DashboardGroup.fromJson(Json json) => DashboardGroup(
    module: '${json['module']}',
    title: '${json['title']}',
    kpis: [for (final k in (json['kpis'] as List?) ?? const []) Kpi.fromJson(k as Json)],
    failed: json['failed'] == true,
  );

  /// The module's key.
  final String module;

  /// The area's name.
  final String title;

  /// Its numbers.
  final List<Kpi> kpis;

  /// The module could not answer just now.
  final bool failed;
}
