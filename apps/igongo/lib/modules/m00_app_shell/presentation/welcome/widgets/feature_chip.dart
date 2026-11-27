// A small bordered chip with an icon and a label, used to list what the hotel
// offers on the first onboarding screen.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// One feature chip: an icon and its words.
class FeatureChip extends StatelessWidget {
  /// Creates a chip showing [icon] and [label].
  const FeatureChip({super.key, required this.icon, required this.label});

  /// The icon before the words.
  final IconData icon;

  /// The words on the chip.
  final String label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: a rounded, bordered box holding the icon and the label in a row.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        border: Border.all(color: p.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: IgongoSpace.xs,
        children: [
          Icon(icon, size: IgongoSpace.lg, color: p.primary),
          Text(label, style: context.text.labelLarge?.copyWith(color: p.text)),
        ],
      ),
    );
  }
}
