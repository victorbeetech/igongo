// One category pill: a rounded tag with an icon and, when ticked, a check mark.
// Its tap area is 44 high so it is easy to press, but the pill itself is 36 high.

import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/refine_option.dart';

/// A tickable category pill.
class RefineCategoryPill extends StatelessWidget {
  /// Creates a pill for [option]. [selected] draws it ticked; [onTap] flips it.
  const RefineCategoryPill({super.key, required this.option, required this.selected, required this.onTap});

  /// The category this pill stands for.
  final RefineOption option;

  /// Whether the category is ticked.
  final bool selected;

  /// Called when the pill is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: ticked pills are red with white words; the rest are quiet grey.
    final foreground = selected ? palette.onPrimary : palette.textMuted;
    final style = context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w600, color: foreground);
    return Semantics(
      button: true,
      toggled: selected,
      child: Padding(
        // Step 2: 4 pixels above and below, so the 36-high pill sits in a 44-high tap area.
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Material(
          color: selected ? palette.primary : palette.surfaceAlt,
          shape: const StadiumBorder(),
          child: InkWell(
            customBorder: const StadiumBorder(),
            onTap: onTap,
            child: SizedBox(
              height: 36,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                // Step 3: the icon, the label and, when ticked, the check mark.
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  spacing: 6,
                  children: [
                    if (option.icon != null) Icon(option.icon, size: 16, color: foreground),
                    Text(option.label, style: style),
                    if (selected) Icon(Icons.check, size: 16, color: foreground),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
