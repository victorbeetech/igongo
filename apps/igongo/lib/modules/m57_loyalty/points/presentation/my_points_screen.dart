// S57-01 My points (live): the guest's balance and what it is worth, the
// expiry warning, the rules in plain words, and the points history. While the
// programme is off it shows only a neutral line, and the Me screen has no row for it.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/day_label.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/kpi/kpi_card.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../application/points_providers.dart';
import '../domain/points_wallet.dart';

/// My points: the guest's own wallet, reloaded on pull down.
class MyPointsScreen extends ConsumerWidget {
  /// Creates the screen. It has no inputs: it always shows the signed-in guest's own points.
  const MyPointsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wallet = ref.watch(pointsWalletProvider);
    return RefreshIndicator(
      onRefresh: () => ref.refresh(pointsWalletProvider.future),
      child: ScreenListView(
        children: [
          // Step 1: the wallet is loading, failed, off, or loaded. Off shows a neutral line only.
          wallet.when(
            loading: () => const Padding(
              padding: EdgeInsets.all(IgongoSpace.lg),
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (error, stack) => Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Text('Your points could not be loaded. Pull down to try again.', style: context.text.bodyMedium),
            ),
            data: (w) => w.enabled
                ? _PointsBody(wallet: w)
                : Padding(
                    padding: const EdgeInsets.all(IgongoSpace.lg),
                    child: Text('Points are not available right now.', style: context.text.bodyMedium),
                  ),
          ),
        ],
      ),
    );
  }
}

/// The loaded wallet: the balance, the rules in words, the expiry warning and the history.
class _PointsBody extends StatelessWidget {
  /// Creates the body for an enabled [wallet].
  const _PointsBody({required this.wallet});

  /// The guest's wallet, with the programme on.
  final PointsWallet wallet;

  @override
  Widget build(BuildContext context) {
    final soon = wallet.expiringSoon;
    final earnPlural = wallet.pointsPer1000Ugx == 1 ? '' : 's';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // The balance and what it is worth to spend.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: KpiCard(label: 'Your points', value: '${wallet.balance}'),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Text('Worth ${ugx(wallet.valueUgx)} to spend on an order.', style: context.text.bodyMedium),
        ),
        // How to earn and spend, in plain words, from the rules the super admin set.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.sm,
            children: [
              Text('Earn ${wallet.pointsPer1000Ugx} point$earnPlural for every UGX 1,000 you pay on an order.', style: context.text.bodyMedium),
              Text(
                'Spend ${wallet.minimumToRedeem} points or more at once. Each point takes off ${ugx(wallet.ugxPerPoint)}.',
                style: context.text.bodyMedium,
              ),
              Text(
                wallet.expiryDays == 0 ? 'Points never expire.' : 'Points expire ${wallet.expiryDays} days after you earn them.',
                style: context.text.bodyMedium,
              ),
              // Points about to expire, with the day they go.
              if (soon != null)
                Text('${soon.points} points expire on ${shortDay(soon.expiresOn)}.', style: context.text.bodyMedium),
            ],
          ),
        ),
        // The newest history lines.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Text('History', style: context.text.titleSmall),
        ),
        if (wallet.history.isEmpty)
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Text('No points yet.', style: context.text.bodyMedium),
          ),
        for (final entry in wallet.history)
          IgongoListRow(
            title: entry.note,
            subtitle: '${entry.points > 0 ? '+' : ''}${entry.points} points · ${shortDay(entry.createdAt)}',
          ),
      ],
    );
  }
}
