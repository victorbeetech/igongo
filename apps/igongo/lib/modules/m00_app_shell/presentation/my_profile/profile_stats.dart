// The three stat tiles: Bookings, Orders and Points, read live from
// `/api/me/stats`. A number that is 0, still loading or not available shows a
// dash, so nothing made up ever appears on the profile.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../application/me_stats_providers.dart';
import 'profile_stat_tile.dart';

/// The row of three tiles.
class ProfileStats extends ConsumerWidget {
  /// Creates the row.
  const ProfileStats({super.key});

  /// A dash, shown when a number is 0, still loading or unavailable.
  static const _unknown = '—';

  /// The count as text, or a dash when there is nothing to show.
  static String _shown(int? n) => (n == null || n == 0) ? _unknown : '$n';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the live numbers (null while loading or when the load fails, so the dash shows).
    final stats = ref.watch(meStatsProvider).valueOrNull;
    // Step 2: three equal tiles side by side.
    return Row(
      spacing: IgongoSpace.sm,
      children: [
        Expanded(
          child: ProfileStatTile(icon: Icons.calendar_today_outlined, label: 'Bookings', value: _shown(stats?.bookings)),
        ),
        Expanded(
          child: ProfileStatTile(icon: Icons.shopping_bag_outlined, label: 'Orders', value: _shown(stats?.orders)),
        ),
        Expanded(
          child: ProfileStatTile(icon: Icons.auto_awesome_outlined, label: 'Points', value: _shown(stats?.points)),
        ),
      ],
    );
  }
}
