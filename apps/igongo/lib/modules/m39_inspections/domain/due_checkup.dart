// A checklist due today (or this week) and, when done, who did it and the score.

import '../../../shared/api/api_client.dart';
import 'checklist.dart';

/// One due checkup.
class DueCheckup {
  /// Creates one.
  const DueCheckup({required this.checklist, this.doneBy, this.score});

  /// Reads one from `GET /api/inspections/today`.
  factory DueCheckup.fromJson(Json json) {
    final done = json['done'] as Json?;
    return DueCheckup(
      checklist: Checklist.fromJson(json['checklist'] as Json),
      doneBy: done?['inspectorName'] as String?,
      score: (done?['score'] as num?)?.toInt(),
    );
  }

  /// The checklist.
  final Checklist checklist;

  /// Who did it, or null when still due.
  final String? doneBy;

  /// Its score in percent, when done.
  final int? score;
}
