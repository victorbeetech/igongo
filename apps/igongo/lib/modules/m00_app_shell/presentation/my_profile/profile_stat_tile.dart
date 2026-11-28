// One of the three stat tiles under the profile card: a soft icon disc, the
// label in small capitals, and the number in bold.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A tile showing one number, such as Bookings 3.
class ProfileStatTile extends StatelessWidget {
  /// Creates a tile.
  const ProfileStatTile({super.key, required this.icon, required this.label, required this.value});

  /// The icon above the label.
  final IconData icon;

  /// The name of the number, such as "Orders".
  final String label;

  /// The number as text, or a dash when it is not known yet.
  final String value;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      label: '$label, $value',
      child: Container(
        // Step 1: a soft tile in the surface colour.
        padding: const EdgeInsets.symmetric(vertical: IgongoSpace.md, horizontal: IgongoSpace.sm),
        decoration: BoxDecoration(
          color: p.surface,
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          border: Border.all(color: p.border),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Step 2: the icon in a soft red disc, the label in small capitals, then the number.
            Container(
              width: 32,
              height: 32,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
              child: Icon(icon, color: p.primaryText, size: 16),
            ),
            const SizedBox(height: IgongoSpace.xs),
            Text(
              label.toUpperCase(),
              style: context.text.labelSmall?.copyWith(color: p.textMuted, letterSpacing: 1.1),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: IgongoSpace.xxs),
            Text(value, style: context.text.titleLarge, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
