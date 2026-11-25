// The daily report form: one text box per template section, with Save
// draft and Send buttons while the report can still change.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../domain/my_report_day.dart';
import '../../domain/report_section.dart';

/// Called with the answers, and whether to send them for sign-off.
typedef SaveReport = Future<void> Function(List<ReportSection> sections, bool submit);

/// The form for one day's report.
class ReportForm extends StatefulWidget {
  /// Creates the form for [day].
  const ReportForm({super.key, required this.day, required this.onSave});

  /// The day's report.
  final MyReportDay day;

  /// Saves the answers.
  final SaveReport onSave;

  @override
  State<ReportForm> createState() => _ReportFormState();
}

class _ReportFormState extends State<ReportForm> {
  // One text box per section, filled with what was saved.
  late final _boxes = [for (final s in widget.day.sections) TextEditingController(text: s.text)];
  bool _busy = false;

  @override
  void dispose() {
    for (final b in _boxes) {
      b.dispose();
    }
    super.dispose();
  }

  /// Collects the answers and saves them; the buttons rest while it runs.
  Future<void> _save(bool submit) async {
    setState(() => _busy = true);
    final sections = [for (final (i, s) in widget.day.sections.indexed) ReportSection(s.title, _boxes[i].text.trim())];
    await widget.onSave(sections, submit);
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final day = widget.day;
    return Padding(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.md,
        children: [
          // Editable: a box per section. Sent or signed: the answers as text.
          for (final (i, s) in day.sections.indexed)
            if (day.editable)
              IgongoField(label: s.title, lines: 4, controller: _boxes[i])
            else
              Text('${s.title}\n${s.text.isEmpty ? '—' : s.text}'),
          if (day.editable) ...[
            IgongoButton(label: 'Send for sign-off', expand: true, onPressed: _busy ? null : () => _save(true)),
            IgongoButton(
              label: 'Save draft',
              variant: ButtonVariant.secondary,
              expand: true,
              onPressed: _busy ? null : () => _save(false),
            ),
          ],
        ],
      ),
    );
  }
}
