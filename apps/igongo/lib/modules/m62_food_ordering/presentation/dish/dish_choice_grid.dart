// The 2-column grid of checkbox choices, used for multi-choice option groups
// (the beverage pairing in the design). Each cell is a tappable card with the
// name and price; picked cells are tinted.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/option_choice.dart';

/// Lays [choices] out two per row; [picked] are highlighted and [onToggle] flips one.
class DishChoiceGrid extends StatelessWidget {
  /// Creates the grid.
  const DishChoiceGrid({super.key, required this.choices, required this.picked, required this.onToggle});

  /// The choices shown, in menu order.
  final List<OptionChoice> choices;

  /// The keys picked in this group.
  final Set<String> picked;

  /// Flips the choice with this key.
  final ValueChanged<String> onToggle;

  @override
  Widget build(BuildContext context) {
    // Step 1: split the choices into rows of two (an odd last one gets an empty half).
    final rows = <List<OptionChoice?>>[];
    for (var i = 0; i < choices.length; i += 2) {
      rows.add([choices[i], i + 1 < choices.length ? choices[i + 1] : null]);
    }
    // Step 2: each row is two equal cells with a gap between them.
    return Column(
      children: [
        for (final row in rows)
          Padding(
            padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    child: _GridCell(choice: row[0]!, picked: picked, onToggle: onToggle),
                  ),
                  const SizedBox(width: IgongoSpace.sm),
                  Expanded(
                    child: row[1] == null
                        ? const SizedBox.shrink()
                        : _GridCell(choice: row[1]!, picked: picked, onToggle: onToggle),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// One grid cell: checkbox on top, the name, and the price under it.
class _GridCell extends StatelessWidget {
  const _GridCell({required this.choice, required this.picked, required this.onToggle});

  /// The choice in this cell.
  final OptionChoice choice;

  /// The keys picked in the group.
  final Set<String> picked;

  /// Flips this choice.
  final ValueChanged<String> onToggle;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final selected = picked.contains(choice.key);
    // Step 1: free choices say "Included"; add-ons show their price.
    final price = choice.priceDelta == 0 ? 'Included' : '+${ugx(choice.priceDelta)}';
    return Material(
      color: selected ? palette.primaryContainer : palette.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        side: BorderSide(color: selected ? palette.primaryText : palette.border),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        onTap: () => onToggle(choice.key),
        // Step 2: the cell is at least the minimum touch size tall.
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: IgongoTouch.minimum * 2),
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.sm),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 3: the checkbox, ignoring its own taps so the whole cell is the target.
                Align(
                  alignment: Alignment.topRight,
                  child: IgnorePointer(
                    child: Checkbox(value: selected, onChanged: (_) {}),
                  ),
                ),
                const SizedBox(height: IgongoSpace.xs),
                Text(choice.name, style: context.text.bodyMedium),
                const SizedBox(height: IgongoSpace.xxs),
                Text(price, style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
