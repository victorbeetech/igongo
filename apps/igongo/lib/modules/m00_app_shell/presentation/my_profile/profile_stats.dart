// The three stat tiles: Bookings, Orders and Points. Orders is read live from
// the API. Bookings shows a dash until the API gives a total (bookings are
// counted per booking module). Points shows a fixed placeholder (450) until the
// points system exists as its own module.

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

  // PLACEHOLDER (owner's request): the points total is a fixed 450 for now.
  // The points system is a separate module for later; replace this constant
  // with the live total from that module, and do not add points logic here.
  static const _pointsPlaceholder = '450';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the live order count (shows a dash while loading or if it fails).
    final orders = ref.watch(myOrdersProvider).when(
      data: (list) => '${list.length}',
      loading: () => _unknown,
      error: (_, _) => _unknown,
    );
    // Step 2: three equal tiles side by side.
    return Row(
      spacing: IgongoSpace.sm,
      children: [
        const Expanded(child: ProfileStatTile(icon: Icons.event_available_outlined, label: 'Bookings', value: _unknown)),
        Expanded(child: ProfileStatTile(icon: Icons.shopping_cart_outlined, label: 'Orders', value: orders)),
        const Expanded(child: ProfileStatTile(icon: Icons.star_rounded, label: 'Points', value: _pointsPlaceholder)),
      ],
    );
  }
}
