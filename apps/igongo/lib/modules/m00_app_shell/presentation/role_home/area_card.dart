// A guest's area card on the home: a white rounded card with a red icon disc,
// the area's name (up to two lines) and an arrow. Photos are not used here.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// One area of the hotel (rooms, spa, pool...), tapped to open it.
class AreaCard extends StatelessWidget {
  /// Creates the card.
  const AreaCard({super.key, required this.label, required this.subtitle, required this.icon, required this.onTap});

  /// The area's name, such as Spa.
  final String label;

  /// The short line under the name, such as "Heritage rooms" (a placeholder until wired).
  final String subtitle;

  /// The area's icon.
  final IconData icon;

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.lg);
    return Semantics(
      button: true,
      label: label,
      child: Material(
        color: p.surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: radius,
          side: BorderSide(color: p.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          // The whole card opens the area.
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            // Step 1: the red icon disc, then the name, then the arrow.
            child: Row(
              children: [
                DecoratedBox(
                  decoration: BoxDecoration(color: p.primary, shape: BoxShape.circle),
                  child: Padding(
                    padding: const EdgeInsets.all(IgongoSpace.sm),
                    child: Icon(icon, size: IgongoSpace.lg, color: p.onPrimary),
                  ),
                ),
                const SizedBox(width: IgongoSpace.sm),
                // Step 2: the name, up to two lines, with the subtitle under it.
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        label,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.labelLarge?.copyWith(color: p.text, fontWeight: FontWeight.w700),
                      ),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.labelSmall?.copyWith(color: p.textMuted),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.chevron_right, size: IgongoSpace.lg, color: p.textMuted),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
