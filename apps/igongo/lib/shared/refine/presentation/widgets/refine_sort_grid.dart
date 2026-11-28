// The Sort By section's grid: sort chips in two columns, row by row, all the same height.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../domain/refine_option.dart';
import 'refine_sort_chip.dart';

/// Two-column grid of sort chips where exactly one is picked.
class RefineSortGrid extends StatelessWidget {
  /// Creates the grid of [options]. [selected] is the index of the picked one; [onPick] gets a new index.
  const RefineSortGrid({super.key, required this.options, required this.selected, required this.onPick});

  /// The sort orders, in display order.
  final List<RefineOption> options;

  /// The index of the chosen order.
  final int selected;

  /// Called with the index of the order the person taps.
  final ValueChanged<int> onPick;

  @override
  Widget build(BuildContext context) {
    // Step 1: group the chips into rows of two (the last row may hold one).
    final rows = <Widget>[];
    for (var i = 0; i < options.length; i += 2) {
      final hasSecond = i + 1 < options.length;
      rows.add(
        // Step 2: each row is as tall as its tallest chip, so the two chips line up.
        IntrinsicHeight(
          child: Row(
            spacing: IgongoSpace.sm,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(child: _chip(i)),
              Expanded(child: hasSecond ? _chip(i + 1) : const SizedBox.shrink()),
            ],
          ),
        ),
      );
    }
    return Column(spacing: IgongoSpace.sm, children: rows);
  }

  /// The chip for the option at [index].
  Widget _chip(int index) =>
      RefineSortChip(label: options[index].label, selected: index == selected, onTap: () => onPick(index));
}
