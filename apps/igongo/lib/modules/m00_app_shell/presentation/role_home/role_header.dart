// The top of every role home: a red card with the white mark, the greeting
// with the person's own name, and their role. No role switch: one account
// is one kind.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';

/// The greeting card at the top of a role home.
class RoleHeader extends StatelessWidget {
  /// Creates the header for [role]; [name] is the signed-in person's, or null when signed out.
  const RoleHeader({super.key, required this.role, this.name});

  /// The role whose home this is.
  final RoleSpec role;

  /// The signed-in person's name.
  final String? name;

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
                Text(
                  name == null ? 'Welcome to Igongo' : 'Hello, ${name!.split(' ').first}',
                  style: context.text.titleMedium?.copyWith(color: p.onPrimary),
                ),
                Text(role.name, style: context.text.bodySmall?.copyWith(color: p.onPrimary.withValues(alpha: 0.85))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
