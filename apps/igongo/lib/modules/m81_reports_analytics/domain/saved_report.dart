// A saved report: a named pick of areas over 1, 7 or 30 days, maybe run by
// itself at 7 AM Kampala time (daily, Mondays, or on the 1st).

import '../../../shared/api/api_client.dart';

/// The schedule choices, in words.
const scheduleWords = {
  'none': 'Only when run by hand',
  'daily': 'Every day at 7 AM',
  'weekly': 'Every Monday at 7 AM',
  'monthly': 'On the 1st at 7 AM',
};

/// One saved report.
class SavedReport {
  /// Creates a report.
  const SavedReport({
    required this.id,
    required this.name,
    required this.ownerName,
    required this.modules,
    required this.days,
    required this.schedule,
    required this.lastRunAt,
  });

  /// Reads one from the API's JSON.
  factory SavedReport.fromJson(Json json) => SavedReport(
    id: '${json['id']}',
    name: '${json['name']}',
    ownerName: '${json['ownerName']}',
    modules: [for (final m in (json['modules'] as List?) ?? const []) '$m'],
    days: (json['days'] as num?)?.toInt() ?? 1,
    schedule: '${json['schedule']}',
    lastRunAt: json['lastRunAt'] == null ? null : DateTime.parse('${json['lastRunAt']}').toLocal(),
  );

  /// The report's ID.
  final String id;

  /// Its name.
  final String name;

  /// Who saved it.
  final String ownerName;

  /// Its areas; empty means every area its owner may see.
  final List<String> modules;

  /// The days it covers: 1, 7 or 30.
  final int days;

  /// none, daily, weekly or monthly.
  final String schedule;

  /// When it last ran, if ever.
  final DateTime? lastRunAt;
}
