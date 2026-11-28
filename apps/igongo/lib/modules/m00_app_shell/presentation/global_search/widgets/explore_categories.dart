// The "Explore Categories" row: a title with a tagline, then a row of pills that
// scrolls sideways. The chosen pill is Igongo red; the others are soft.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The category pills row.
class ExploreCategories extends StatelessWidget {
  /// Creates the row. [selected] is the index of the chosen pill.
  const ExploreCategories({
    super.key,
    required this.categories,
    required this.selected,
    required this.onSelected,
  });

  /// Each pill's words and icon.
  final List<({String label, IconData icon})> categories;

  /// The index of the chosen pill.
  final int selected;

  /// Called with the index of the pill that is tapped.
  final ValueChanged<int> onSelected;

  /// The height of the scrolling row (room for a pill and its shadow).
  static const double _rowHeight = 48;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Step 1: the title on the left, and the tagline in the accent colour on the right.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Row(
            children: [
              Expanded(child: Text('Explore Categories', style: context.text.labelMedium)),
              Text(
                "Uganda's Oasis",
                style: context.text.labelSmall?.copyWith(color: p.warning, fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ),
        const SizedBox(height: IgongoSpace.sm),
        // Step 2: the pills, one per category, scrolling sideways.
        SizedBox(
          height: _rowHeight,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            itemCount: categories.length,
            separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
            itemBuilder: (context, index) {
              final category = categories[index];
              final isOn = index == selected;
              return ChoiceChip(
                selected: isOn,
                onSelected: (_) => onSelected(index),
                showCheckmark: false,
                side: BorderSide.none,
                backgroundColor: p.surfaceAlt,
                selectedColor: p.primary,
                avatar: Icon(category.icon, size: IgongoSpace.lg, color: isOn ? p.onPrimary : p.text),
                label: Text(
                  category.label,
                  style: context.text.labelMedium?.copyWith(color: isOn ? p.onPrimary : p.text),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
