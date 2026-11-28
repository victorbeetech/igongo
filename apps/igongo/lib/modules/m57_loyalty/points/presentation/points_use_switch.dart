// The checkout's "Use my points" switch. It shows only while the programme is
// on, the guest has enough points, and the order is worth at least the
// minimum. The points it offers never go past the order's total or the balance.

import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/format/ugx.dart';
import '../application/points_providers.dart';

/// The switch on the checkout. [total] is the order's total in shillings; [on] and [onChanged] hold the choice.
class PointsUseSwitch extends ConsumerWidget {
  /// Creates the switch.
  const PointsUseSwitch({super.key, required this.total, required this.on, required this.onChanged});

  /// The order's total before points, in shillings.
  final int total;

  /// Whether the guest wants to use points on this order.
  final bool on;

  /// Called when the guest flips the switch.
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wallet = ref.watch(pointsWalletProvider).valueOrNull;
    // Step 1: show only when the guest can spend, and this order can use at least the minimum.
    if (wallet == null || !wallet.canSpend) return const SizedBox.shrink();
    final points = wallet.pointsFor(total);
    if (points < wallet.minimumToRedeem) return const SizedBox.shrink();
    // Step 2: the switch, with what it takes off.
    return SwitchListTile(
      title: Text('Use $points points'),
      subtitle: Text('${ugx(points * wallet.ugxPerPoint)} off this order'),
      value: on,
      onChanged: onChanged,
    );
  }
}
