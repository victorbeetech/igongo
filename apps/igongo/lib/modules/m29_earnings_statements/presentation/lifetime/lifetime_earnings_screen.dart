// S29-03 Lifetime earnings, live: everything I have earned at Igongo, in
// total and by year, including bonuses, buffet passes and advances.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/kpi/kpi_card.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../application/earnings_providers.dart';
import '../../domain/earnings_statement.dart';

/// My lifetime statement.
class LifetimeEarningsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const LifetimeEarningsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<EarningsStatement>(
    screenName: screen.spec.name,
    value: ref.watch(myStatementProvider),
    onRetry: () => ref.invalidate(myStatementProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, s, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (final (label, value) in [
                ('Net pay', ugx(s.lifetime.net)),
                ('Gross pay', ugx(s.lifetime.gross)),
                ('Cash bonuses', ugx(s.lifetime.cashBonuses)),
                ('Buffet passes', '${s.lifetime.buffetPasses}'),
                ('Advances taken', ugx(s.lifetime.advancesTaken)),
                ('Payslips', '${s.lifetime.payslips}'),
              ])
                SizedBox(
                  width: 160,
                  child: KpiCard(label: label, value: value),
                ),
            ],
          ),
        ),
        const SectionHeader('By year'),
        if (s.years.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No pay yet.')),
        for (final (year, t) in s.years)
          IgongoListRow(
            title: year,
            subtitle: 'Net ${ugx(t.net)} · bonuses ${ugx(t.cashBonuses)} · ${t.buffetPasses} buffet passes',
          ),
      ],
    ),
  );
}
