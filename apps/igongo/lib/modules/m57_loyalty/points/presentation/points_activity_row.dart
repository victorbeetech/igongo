// The "My Points" row on the guest's Me screen. It is there only while the
// programme is on and the wallet has loaded; while off it takes no space.

import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../m00_app_shell/presentation/my_profile/profile_action_row.dart';
import '../application/points_providers.dart';

/// The row that opens My points (S57-01). Hidden while the programme is off.
class PointsActivityRow extends ConsumerWidget {
  /// Creates the row; [onTap] opens My points.
  const PointsActivityRow({super.key, required this.onTap});

  /// Opens My points (S57-01).
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final wallet = ref.watch(pointsWalletProvider).valueOrNull;
    // Step 1: nothing to show until the wallet loads, and nothing at all while the programme is off.
    if (wallet == null || !wallet.enabled) return const SizedBox.shrink();
    // Step 2: the balance and its worth, opening the full screen.
    return ProfileActionRow(
      title: 'My Points',
      subtitle: '${wallet.balance} points · ${ugx(wallet.valueUgx)}',
      icon: Icons.stars_outlined,
      onTap: onTap,
    );
  }
}
