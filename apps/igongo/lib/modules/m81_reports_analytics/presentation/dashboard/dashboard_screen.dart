// S81-01 and S81-02 Dashboard, live: today's (or the last 7 or 30 days')
// numbers from every module I may see. A module that cannot answer shows a
// note while the rest still load.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/kpi/kpi_card.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../application/report_providers.dart';
import '../../domain/dashboard.dart';

/// The ranges to choose from.
const _ranges = [(1, 'Today'), (7, '7 days'), (30, '30 days')];

/// The dashboard.
class DashboardScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const DashboardScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  int _days = 1;

  @override
  Widget build(BuildContext context) => LiveView<Dashboard>(
    screenName: widget.screen.spec.name,
    value: ref.watch(dashboardProvider(_days)),
    onRetry: () => ref.invalidate(dashboardProvider(_days)),
    sample: (_) => screenLayout(widget.screen),
    builder: (context, d, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(dashboardProvider(_days).future),
      child: ScreenListView(
        children: [
          PurposeText(widget.screen.spec.purpose),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: Wrap(
              spacing: IgongoSpace.sm,
              children: [
                for (final (days, label) in _ranges)
                  ChoiceChip(
                    label: Text(label),
                    selected: _days == days,
                    onSelected: (_) => setState(() => _days = days),
                  ),
              ],
            ),
          ),
          if (d.groups.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No numbers for your roles yet.')),
          for (final g in d.groups) ...[
            SectionHeader(g.title),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
              child: g.failed
                  ? const Text('These numbers could not be read just now.')
                  : Wrap(
                      spacing: IgongoSpace.sm,
                      runSpacing: IgongoSpace.sm,
                      children: [
                        for (final k in g.kpis)
                          SizedBox(
                            width: 160,
                            child: KpiCard(label: k.label, value: k.shown),
                          ),
                      ],
                    ),
            ),
          ],
        ],
      ),
    ),
  );
}
