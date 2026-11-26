// S31-01 My rewards, live: buffet passes I can use now (big number), and
// every cash bonus and pass I have been given.

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
import '../../application/bonus_providers.dart';
import '../../domain/my_rewards.dart';

/// My rewards.
class MyRewardsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyRewardsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<MyRewards>(
    screenName: screen.spec.name,
    value: ref.watch(myRewardsProvider),
    onRetry: () => ref.invalidate(myRewardsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, page, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myRewardsProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: KpiCard(label: 'Buffet passes you can use', value: '${page.passesLeft}'),
          ),
          if (page.items.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No rewards yet.')),
          for (final b in page.items)
            IgongoListRow(
              title: b.kind == 'cash'
                  ? 'Cash bonus ${ugx(b.amount)}'
                  : '${b.passes} buffet pass${b.passes == 1 ? '' : 'es'} (${b.passesUsed} used)',
              subtitle: [
                b.reason,
                'from ${b.awardedByName}',
                if (b.validUntil != null) 'valid until ${b.validUntil}',
              ].join(' · '),
              status: statusWords(b.status),
            ),
        ],
      ),
    ),
  );
}
