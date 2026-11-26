// One run of a saved report, live: its days and numbers as they were.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../application/report_providers.dart';
import '../../domain/report_run.dart';
import '../parts/kpi_groups.dart';

/// The run [id].
class ReportRunScreen extends ConsumerWidget {
  /// Creates the screen for run [id].
  const ReportRunScreen({super.key, required this.id});

  /// The run's ID.
  final String id;

  @override
  Widget build(BuildContext context, WidgetRef ref) => Scaffold(
    appBar: AppBar(title: const Text('Report')),
    body: LiveView<ReportRun>(
      screenName: 'Report',
      value: ref.watch(reportRunProvider(id)),
      onRetry: () => ref.invalidate(reportRunProvider(id)),
      sample: (_) => const SizedBox.shrink(),
      builder: (context, r, _) => ScreenListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.xs,
              children: [
                Text(r.reportName, style: context.text.titleLarge),
                Text(
                  'Hotel days ${r.days} · ${r.bySchedule ? 'Ran at 7 AM' : 'Run by hand'} ${dayTime(r.ranAt)}',
                  style: context.text.bodySmall,
                ),
              ],
            ),
          ),
          if (r.groups.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('This run had no areas to show.')),
          ...kpiGroups(r.groups),
        ],
      ),
    ),
  );
}
