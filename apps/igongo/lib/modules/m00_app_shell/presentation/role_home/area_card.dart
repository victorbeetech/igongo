// A guest's area card on the home: a large tappable card with the area's
// icon and name, in the theme's colours. Photos are added once the hotel
// sends its own pictures; until then no stock photo is shown.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

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
    // Step 1: the theme's colours, so light and dark both read well.
    final scheme = Theme.of(context).colorScheme;
    return Semantics(
      button: true,
      label: label,
      child: Material(
        color: scheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(IgongoSpace.md),
          side: BorderSide(color: scheme.primary.withValues(alpha: 0.25)),
        ),
        child: InkWell(
          // Step 2: the whole card opens the area.
          borderRadius: BorderRadius.circular(IgongoSpace.md),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Step 3: the icon in a red disc, then the name.
                CircleAvatar(
                  backgroundColor: scheme.primaryContainer,
                  foregroundColor: scheme.primary,
                  child: Icon(icon),
                ),
                const SizedBox(height: IgongoSpace.sm),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: scheme.onSurface),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
