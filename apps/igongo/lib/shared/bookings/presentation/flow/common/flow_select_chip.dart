// A pill-shaped choice used for short options (language, pressure, occasion,
// snack preference). One chip is picked at a time and filled red.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// A single selectable pill with [label] and an optional [icon].
class FlowSelectChip extends StatelessWidget {
  /// Creates the chip.
  const FlowSelectChip({super.key, required this.label, required this.selected, required this.onTap, this.icon});

  /// The words on the chip.
  final String label;

  /// Whether this chip is picked.
  final bool selected;

  /// Called when the guest taps the chip.
  final VoidCallback onTap;

  /// Optional icon shown before the label.
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final foreground = selected ? palette.onPrimary : palette.text;
    // Step 1: the pill, filled red when picked.
    return Material(
      color: selected ? palette.primary : palette.surface,
      shape: StadiumBorder(side: BorderSide(color: selected ? palette.primary : palette.border)),
      child: InkWell(
        customBorder: const StadiumBorder(),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[Icon(icon, size: 16, color: foreground), const SizedBox(width: IgongoSpace.xs)],
              Flexible(
                child: Text(
                  label,
                  textAlign: TextAlign.center,
                  style: context.text.labelLarge?.copyWith(color: foreground, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
