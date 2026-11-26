// S81-04 Saved reports, live: my saved reports (made on the web's report
// builder), each with its schedule and last run. Run one now, or open its
// past runs. Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/report_providers.dart';
import '../../domain/saved_report.dart';
import 'past_runs_sheet.dart';
import 'report_run_screen.dart';

/// The saved reports.
class SavedReportsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const SavedReportsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Runs [r] now and opens the run; a refusal shows as a toast.
  Future<void> _runNow(BuildContext context, WidgetRef ref, SavedReport r) async {
    try {
      final run = await ref.read(reportsApiProvider).run(r.id);
      ref.invalidate(savedReportsProvider);
      if (context.mounted) {
        await Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ReportRunScreen(id: run.id)));
      }
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<SavedReport>>(
    screenName: screen.spec.name,
    value: ref.watch(savedReportsProvider),
    onRetry: () => ref.invalidate(savedReportsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, reports, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(savedReportsProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (reports.isEmpty)
            const Padding(
              padding: EdgeInsets.all(IgongoSpace.lg),
              child: Text('No saved reports yet. Make one with the report builder on the web.'),
            ),
          for (final r in reports)
            IgongoListRow(
              title: r.name,
              subtitle: [
                scheduleWords[r.schedule] ?? r.schedule,
                r.lastRunAt == null ? 'Not run yet' : 'Last run ${dayTime(r.lastRunAt!)}',
              ].join(' · '),
              onTap: () => showPastRuns(context, r, onRunNow: () => _runNow(context, ref, r)),
            ),
        ],
      ),
    ),
  );
}
