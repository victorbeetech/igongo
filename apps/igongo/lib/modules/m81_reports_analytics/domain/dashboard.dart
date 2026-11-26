// The management dashboard for a range of hotel days.

import '../../../shared/api/api_client.dart';
import 'dashboard_group.dart';

/// The dashboard.
class Dashboard {
  /// Creates the dashboard.
  const Dashboard({required this.from, required this.to, required this.groups});

  /// Reads it from `GET /api/reports/dashboard`.
  factory Dashboard.fromJson(Json json) => Dashboard(
    from: '${json['from']}',
    to: '${json['to']}',
    groups: [for (final g in json['groups'] as List) DashboardGroup.fromJson(g as Json)],
  );

  /// The first hotel day.
  final String from;

  /// The last hotel day.
  final String to;

  /// Each area's numbers.
  final List<DashboardGroup> groups;
}
