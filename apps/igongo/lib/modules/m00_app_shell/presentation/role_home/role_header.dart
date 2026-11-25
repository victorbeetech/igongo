// The top of every role home: a red card with the white mark, the greeting,
// the role name and a button to switch roles.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';

/// The greeting card at the top of a role home.
class RoleHeader extends StatelessWidget {
  /// Creates the header for [role]. [onSwitch] opens the role switcher.
  const RoleHeader({super.key, required this.role, required this.onSwitch});

  /// The role whose home this is.
  final RoleSpec role;

  /// Opens the role switcher.
  final VoidCallback onSwitch;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Igongo red is the same in light and dark mode, so this card looks the same in both.
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(color: p.primary, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        spacing: IgongoSpace.md,
        children: [
          const IgongoLogo(height: 44, onRed: true),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 2,
              children: [
                Text('Good morning, Grace', style: context.text.titleMedium?.copyWith(color: p.onPrimary)),
                Text(role.name, style: context.text.bodySmall?.copyWith(color: p.onPrimary.withValues(alpha: 0.85))),
              ],
            ),
          ),
          // White on red keeps the 6.2:1 contrast from the theme notes.
          TextButton.icon(
            onPressed: onSwitch,
            style: TextButton.styleFrom(foregroundColor: p.onPrimary),
            icon: const Icon(Icons.swap_horiz, size: 18),
            label: const Text('Switch'),
          ),
        ],
      ),
    );
  }
}
