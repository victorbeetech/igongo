// One amenity row: an icon, the feature's name and a tick box on the right. Tapping anywhere on the row flips it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/refine_option.dart';
import 'refine_check_box.dart';

/// A tickable amenity or feature row.
class RefineAmenityRow extends StatelessWidget {
  /// Creates the row for [option]. [on] is whether it is ticked; [onTap] flips it.
  const RefineAmenityRow({super.key, required this.option, required this.on, required this.onTap});

  /// The amenity this row stands for.
  final RefineOption option;

  /// Whether the amenity is ticked.
  final bool on;

  /// Called when the row is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Semantics(
      checked: on,
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(IgongoRadius.sm),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.sm),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.sm),
            child: Row(
              children: [
                // Step 1: the icon and the name, which wraps if it is long.
                Expanded(
                  child: Row(
                    spacing: IgongoSpace.sm,
                    children: [
                      if (option.icon != null) Icon(option.icon, size: 20, color: palette.accent),
                      Expanded(
                        child: Text(option.label, style: context.text.bodyLarge!.copyWith(fontWeight: FontWeight.w500)),
                      ),
                    ],
                  ),
                ),
                // Step 2: the tick box on the right.
                RefineCheckBox(on: on),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
