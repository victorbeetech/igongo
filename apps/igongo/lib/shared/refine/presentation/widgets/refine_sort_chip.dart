// One sort-order chip: a label, with a check mark when it is the chosen order.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// A sort order chip that can be picked.
class RefineSortChip extends StatelessWidget {
  /// Creates a chip showing [label]. [selected] draws it picked; [onTap] picks it.
  const RefineSortChip({super.key, required this.label, required this.selected, required this.onTap});

  /// The words of the sort order.
  final String label;

  /// Whether this order is the chosen one.
  final bool selected;

  /// Called when the chip is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final foreground = selected ? palette.onPrimaryContainer : palette.text;
    return Semantics(
      button: true,
      selected: selected,
      child: Material(
        color: selected ? palette.primaryContainer : palette.background,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            // The label may wrap onto two lines; the check mark stays on the right.
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    label,
                    style: context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w500, color: foreground),
                  ),
                ),
                if (selected) Icon(Icons.check, size: 18, color: foreground),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
