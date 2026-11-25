// One answered section of a daily report.

import '../../../shared/api/api_client.dart';

/// A section title and what the person wrote under it.
class ReportSection {
  /// Creates a section.
  const ReportSection(this.title, this.text);

  /// Reads one from the API's JSON.
  factory ReportSection.fromJson(Json json) => ReportSection('${json['title']}', '${json['text'] ?? ''}');

  /// The question, from the template.
  final String title;

  /// The answer.
  final String text;

  /// The JSON the API takes.
  Json toJson() => {'title': title, 'text': text};
}
