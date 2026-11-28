// A small green pill such as "1 Active", shown on a profile activity row.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A pale green label with green words.
class ProfileStatusBadge extends StatelessWidget {
  /// Creates the badge with its [label].
  const ProfileStatusBadge({super.key, required this.label});

  /// The words inside the badge, such as "1 Active".
  final String label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        color: p.success.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Text(
        label,
        style: context.text.labelSmall?.copyWith(color: p.success, fontWeight: FontWeight.w700),
      ),
    );
  }
}
