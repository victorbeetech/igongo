// One run of a saved report: its days and numbers as they were.

import '../../../shared/api/api_client.dart';
import 'dashboard_group.dart';

/// A run; [groups] is empty in run lists, which leave the numbers out.
class ReportRun {
  /// Creates a run.
  const ReportRun({
    required this.id,
    required this.reportName,
    required this.fromDay,
    required this.toDay,
    required this.bySchedule,
    required this.ranAt,
    required this.groups,
  });

  /// Reads one from the API's JSON.
  factory ReportRun.fromJson(Json json) => ReportRun(
    id: '${json['id']}',
    reportName: '${json['reportName']}',
    fromDay: '${json['fromDay']}',
    toDay: '${json['toDay']}',
    bySchedule: json['trigger'] == 'schedule',
    ranAt: DateTime.parse('${json['ranAt']}').toLocal(),
    groups: [for (final g in (json['groups'] as List?) ?? const []) DashboardGroup.fromJson(g as Json)],
  );

  /// The run's ID.
  final String id;

  /// The report's name when it ran.
  final String reportName;

  /// The first hotel day covered.
  final String fromDay;

  /// The last hotel day covered.
  final String toDay;

  /// True for the 7 AM run, false when run by hand.
  final bool bySchedule;

  /// When it ran.
  final DateTime ranAt;

  /// Each area's numbers.
  final List<DashboardGroup> groups;

  /// The days covered, in words.
  String get days => fromDay == toDay ? fromDay : '$fromDay to $toDay';
}
