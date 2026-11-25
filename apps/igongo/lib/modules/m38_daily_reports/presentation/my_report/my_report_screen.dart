// S38-01 My daily report (and S38-02 Fill daily report), live: today's
// template sections as text boxes, saved as a draft or sent for sign-off.
// Once sent or signed it only reads. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/report_providers.dart';
import '../../domain/my_report_day.dart';
import '../../domain/report_section.dart';
import 'report_form.dart';

/// My daily report.
class MyReportScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyReportScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<MyReportDay>(
    screenName: screen.spec.name,
    value: ref.watch(myReportProvider),
    onRetry: () => ref.invalidate(myReportProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, day, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: the day, its status, and the reviewer's note if returned.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Wrap(
            spacing: IgongoSpace.sm,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [Text('${day.date}, due by ${day.dueBy}'), StatusChip(day.statusWords)],
          ),
        ),
        if (day.reviewNote != null)
          Padding(padding: const EdgeInsets.all(IgongoSpace.lg), child: Text('Note: ${day.reviewNote}')),
        // Step 2: the form (key by date and status so a reload starts fresh).
        ReportForm(
          key: ValueKey('${day.date}-${day.status}'),
          day: day,
          onSave: (sections, submit) => _save(context, ref, day, sections, submit),
        ),
      ],
    ),
  );

  /// Saves or sends the report, tells the person, then reloads it.
  Future<void> _save(
    BuildContext context,
    WidgetRef ref,
    MyReportDay day,
    List<ReportSection> sections,
    bool submit,
  ) async {
    try {
      await ref.read(reportsApiProvider).save(day.date, sections, submit: submit);
      if (context.mounted) showIgongoToast(context, submit ? 'Report sent for sign-off' : 'Draft saved');
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(myReportProvider);
  }
}
