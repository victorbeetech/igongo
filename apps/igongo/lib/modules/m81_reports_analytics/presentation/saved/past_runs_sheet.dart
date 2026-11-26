// A sheet with one saved report's past runs and a Run now button; tapping
// a run opens its numbers.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../application/report_providers.dart';
import '../../domain/report_run.dart';
import '../../domain/saved_report.dart';
import 'report_run_screen.dart';

/// Opens the sheet for [report]; [onRunNow] runs it (the sheet closes first).
Future<void> showPastRuns(BuildContext context, SavedReport report, {required VoidCallback onRunNow}) =>
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (sheet) => _PastRuns(
        report: report,
        onRunNow: () {
          Navigator.of(sheet).pop();
          onRunNow();
        },
      ),
    );

class _PastRuns extends ConsumerWidget {
  const _PastRuns({required this.report, required this.onRunNow});

  final SavedReport report;
  final VoidCallback onRunNow;

  @override
  Widget build(BuildContext context, WidgetRef ref) => SafeArea(
    child: Padding(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          Text(report.name, style: context.text.titleMedium),
          IgongoButton(label: 'Run now', icon: Icons.play_arrow, onPressed: onRunNow),
          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 360),
            child: LiveView<List<ReportRun>>(
              screenName: 'Past runs',
              value: ref.watch(reportRunsProvider(report.id)),
              onRetry: () => ref.invalidate(reportRunsProvider(report.id)),
              sample: (_) => const SizedBox.shrink(),
              builder: (context, runs, _) => runs.isEmpty
                  ? const Text('No runs yet.')
                  : ListView(
                      shrinkWrap: true,
                      children: [
                        for (final r in runs)
                          ListTile(
                            title: Text(r.days),
                            subtitle: Text('${r.bySchedule ? '7 AM run' : 'By hand'} · ${dayTime(r.ranAt)}'),
                            trailing: const Icon(Icons.chevron_right),
                            onTap: () =>
                                Navigator.of(context)
                                    .push(MaterialPageRoute<void>(builder: (_) => ReportRunScreen(id: r.id))),
                          ),
                      ],
                    ),
            ),
          ),
        ],
      ),
    ),
  );
}
