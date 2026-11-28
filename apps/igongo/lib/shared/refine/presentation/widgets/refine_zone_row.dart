// One zone row: an icon, the zone's name with a short line under it, and a radio mark. Only one zone is chosen at a time.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/refine_option.dart';
import 'refine_radio_dot.dart';

/// A single-choice zone row.
class RefineZoneRow extends StatelessWidget {
  /// Creates the row for [option]. [selected] is whether it is the chosen zone; [onTap] picks it.
  const RefineZoneRow({super.key, required this.option, required this.selected, required this.onTap});

  /// The zone this row stands for.
  final RefineOption option;

  /// Whether this zone is the chosen one.
  final bool selected;

  /// Called when the row is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Semantics(
      button: true,
      selected: selected,
      child: Material(
        color: palette.background,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                // Step 1: the icon, then the name and the short line under it.
                Expanded(
                  child: Row(
                    spacing: IgongoSpace.sm,
                    children: [
                      if (option.icon != null) Icon(option.icon, size: 20, color: palette.textMuted),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(option.label, style: context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w600)),
                            if (option.detail != null)
                              Text(option.detail!, style: context.text.bodySmall!.copyWith(color: palette.textMuted)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                // Step 2: the radio mark on the right.
                RefineRadioDot(selected: selected),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
