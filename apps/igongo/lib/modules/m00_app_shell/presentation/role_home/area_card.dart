// A guest's area card on the home: a cream rounded card with a red icon disc,
// the area's name and an arrow. Photos are not used here.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// One area of the hotel (rooms, spa, pool...), tapped to open it.
class AreaCard extends StatelessWidget {
  /// Creates the card.
  const AreaCard({super.key, required this.label, required this.icon, required this.onTap});

  /// The area's name, such as Spa.
  final String label;

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
        color: p.surfaceAlt,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: radius,
          side: BorderSide(color: p.border),
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          // The whole card opens the area.
          onTap: onTap,
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 64),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
              // The red icon disc, the name, then the arrow.
              child: Row(
                spacing: IgongoSpace.sm,
                children: [
                  CircleAvatar(backgroundColor: p.primary, foregroundColor: p.onPrimary, child: Icon(icon)),
                  Expanded(
                    child: Text(label, style: context.text.bodyMedium?.copyWith(color: p.text)),
                  ),
                  Icon(Icons.chevron_right, size: 18, color: p.textMuted),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
