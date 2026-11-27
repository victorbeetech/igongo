// The cuisine pills under the search row: "All" and one pill per menu section
// from the real menu. The chosen pill is Igongo red; the others are soft.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A row of section pills that scrolls sideways.
class CategoryPills extends StatelessWidget {
  /// Creates the row; [selected] is the chosen label and [onSelected] gets a tap.
  const CategoryPills({super.key, required this.labels, required this.selected, required this.onSelected});

  /// The pills' labels, left to right.
  final List<String> labels;

  /// The chosen label.
  final String selected;

  /// Called with the label that was tapped.
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the scrolling row; each pill is at least a 44 pixel tap target.
    return SizedBox(
      height: IgongoTouch.minimum,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
        itemCount: labels.length,
        separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.sm),
        itemBuilder: (_, i) {
          // Step 2: one pill, filled red when it is the chosen one.
          final label = labels[i];
          final on = label == selected;
          return Semantics(
            button: true,
            selected: on,
            child: Material(
              color: on ? p.primary : p.surfaceAlt,
              shape: StadiumBorder(side: BorderSide(color: on ? p.primary : p.border)),
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () => onSelected(label),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
                  child: Center(
                    child: Text(
                      label,
                      style: context.text.labelLarge?.copyWith(
                        fontWeight: on ? FontWeight.w700 : FontWeight.w500,
                        color: on ? p.onPrimary : p.textMuted,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
