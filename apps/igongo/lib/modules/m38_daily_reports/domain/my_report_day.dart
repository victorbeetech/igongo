// My daily report for one day: the template's sections, my answers so far,
// its status and the reviewer's note.

import '../../../shared/api/api_client.dart';
import 'report_section.dart';

/// One day's report, ready to fill in.
class MyReportDay {
  /// Creates a day's report.
  const MyReportDay({
    required this.date,
    required this.status,
    required this.sections,
    required this.dueBy,
    this.reviewNote,
  });

  /// Reads one from the API's JSON (`GET /api/daily-reports/mine`).
  factory MyReportDay.fromJson(Json json) {
    // Step 1: the template's questions, and my saved answers if any.
    final template = json['template'] as Json;
    final report = json['report'] as Json?;
    final saved = {
      for (final s in (report?['sections'] as List<dynamic>? ?? const [])) '${(s as Json)['title']}': '${s['text']}',
    };
    // Step 2: one section per question, answered or blank.
    return MyReportDay(
      date: '${json['date']}',
      status: '${report?['status'] ?? 'new'}',
      dueBy: '${template['dueBy']}',
      reviewNote: report?['reviewNote'] as String?,
      sections: [for (final t in template['sections'] as List<dynamic>) ReportSection('$t', saved['$t'] ?? '')],
    );
  }

  /// The hotel day, `YYYY-MM-DD`.
  final String date;

  /// new, draft, submitted, signed or returned.
  final String status;

  /// The template's sections with my answers.
  final List<ReportSection> sections;

  /// When the report is due, `HH:MM`.
  final String dueBy;

  /// Why it was returned, if it was.
  final String? reviewNote;

  /// I can still change it (not waiting for sign-off, not signed).
  bool get editable => status == 'new' || status == 'draft' || status == 'returned';

  /// The status in words.
  String get statusWords =>
      const {
        'new': 'Not started',
        'draft': 'Draft',
        'submitted': 'Waiting for sign-off',
        'signed': 'Signed',
        'returned': 'Returned',
      }[status] ??
      status;
}
