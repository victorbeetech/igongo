// The "My Points" row on the guest's Me screen. The caller passes the loaded
// wallet and shows this row only while the programme is on.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../m00_app_shell/presentation/my_profile/profile_action_row.dart';
import '../domain/points_wallet.dart';

/// The row that opens My points (S57-01): the balance and its worth.
class PointsActivityRow extends StatelessWidget {
  /// Creates the row for a loaded [wallet]; [onTap] opens My points.
  const PointsActivityRow({super.key, required this.wallet, required this.onTap});

  /// The guest's loaded wallet, with the programme on.
  final PointsWallet wallet;

  /// Opens My points (S57-01).
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    // Step 1: the balance and its worth, opening the full screen.
    return ProfileActionRow(
      title: 'My Points',
      subtitle: '${wallet.balance} points · ${ugx(wallet.valueUgx)}',
      icon: Icons.stars_outlined,
      onTap: onTap,
    );
  }
}
