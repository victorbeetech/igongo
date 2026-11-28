// The "Igongo Royal Member" line above the avatar: a small star and spaced capitals.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The membership line.
class RoyalMemberLabel extends StatelessWidget {
  /// Creates the label.
  const RoyalMemberLabel({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Row(
      spacing: IgongoSpace.xs,
      children: [
        // The star uses the accent colour; the words use Igongo red, which reads better on cream.
        Icon(Icons.stars_outlined, size: 16, color: p.accent),
        Text(
          'IGONGO ROYAL MEMBER',
          style: context.text.labelSmall?.copyWith(color: p.primaryText, letterSpacing: 2, fontWeight: FontWeight.w700),
        ),
      ],
    );
  }
}
