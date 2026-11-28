// The three stat tiles: Bookings, Orders and Points. Orders is read live from
// the API. Bookings and Points show a dash until their totals are read from the
// API (bookings are counted per booking module; points come from the loyalty
// module). No fixed numbers are shown.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../modules/m62_food_ordering/application/orders_providers.dart';
import 'profile_stat_tile.dart';

/// The row of three tiles.
class ProfileStats extends ConsumerWidget {
  /// Creates the row.
  const ProfileStats({super.key});

  /// A dash, shown when a number is not known.
  static const _unknown = '—';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the live order count (shows a dash while loading or if it fails).
    final orders = ref
        .watch(myOrdersProvider)
        .when(data: (list) => '${list.length}', loading: () => _unknown, error: (_, _) => _unknown);
    // Step 2: three equal tiles side by side.
    return Row(
      spacing: IgongoSpace.sm,
      children: [
        // Step 1a: the bookings total is not read yet, so a dash shows.
        const Expanded(
          child: ProfileStatTile(icon: Icons.calendar_today_outlined, label: 'Bookings', value: _unknown),
        ),
        Expanded(
          child: ProfileStatTile(icon: Icons.shopping_bag_outlined, label: 'Orders', value: orders),
        ),
        const Expanded(
          child: ProfileStatTile(icon: Icons.auto_awesome_outlined, label: 'Points', value: _unknown),
        ),
      ],
    );
  }
}
