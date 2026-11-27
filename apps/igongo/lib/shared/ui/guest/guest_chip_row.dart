// A row of choice chips that scrolls sideways: the categories of a guest
// browsing screen (All, Grill, Drinks...). One is selected at a time.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// Sideways-scrolling category chips.
class GuestChipRow extends StatelessWidget {
  /// Creates the row; [selected] is the chosen label and [onSelected] gets a tap.
  const GuestChipRow({super.key, required this.labels, required this.selected, required this.onSelected});

  /// The chips' labels, left to right.
  final List<String> labels;

  /// The chosen label.
  final String selected;

  /// Called with the label that was tapped.
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 48,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
      itemCount: labels.length,
      separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
      itemBuilder: (_, i) =>
          ChoiceChip(label: Text(labels[i]), selected: labels[i] == selected, onSelected: (_) => onSelected(labels[i])),
    ),
  );
}
