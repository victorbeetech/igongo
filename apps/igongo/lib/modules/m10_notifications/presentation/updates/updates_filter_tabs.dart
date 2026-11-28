// The horizontal filter tabs: All, Orders & Stays, Promos and Resort News, each
// with its count. The picked tab is red; the others sit on a quiet fill.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'update_category.dart';

/// The row of filter tabs. Scrolls sideways when the phone is narrow.
class UpdatesFilterTabs extends StatelessWidget {
  /// Creates the tabs with [selected] highlighted and [counts] on each tab.
  const UpdatesFilterTabs({super.key, required this.selected, required this.counts, required this.onSelected});

  /// The tab the person picked.
  final UpdateCategory selected;

  /// How many updates each category holds.
  final Map<UpdateCategory, int> counts;

  /// Called with the category the person taps.
  final ValueChanged<UpdateCategory> onSelected;

  @override
  Widget build(BuildContext context) => SingleChildScrollView(
    scrollDirection: Axis.horizontal,
    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.xs),
    child: Row(
      children: [
        // Step 1: one tab per category, in the order of the enum.
        for (final category in UpdateCategory.values)
          Padding(
            padding: const EdgeInsets.only(right: IgongoSpace.sm),
            child: _FilterTab(
              label: category.label,
              count: counts[category] ?? 0,
              selected: category == selected,
              onTap: () => onSelected(category),
            ),
          ),
      ],
    ),
  );
}

/// One filter tab: its label and count, in the picked or quiet style.
class _FilterTab extends StatelessWidget {
  /// Creates a tab.
  const _FilterTab({required this.label, required this.count, required this.selected, required this.onTap});

  /// The words on the tab.
  final String label;

  /// The count shown after the label.
  final int count;

  /// Whether this tab is the picked one.
  final bool selected;

  /// Called when the tab is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the picked tab is red with white text; the others are quiet.
    final foreground = selected ? p.onPrimary : p.textMuted;
    return Semantics(
      button: true,
      selected: selected,
      label: '$label, $count',
      child: Material(
        color: selected ? p.primary : p.surfaceAlt,
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.pill),
          onTap: onTap,
          // Step 2: the tap area is at least 48 pixels high, as the touch rule asks.
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 48),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    label,
                    style: context.text.labelMedium?.copyWith(color: foreground, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(width: IgongoSpace.xs),
                  // Step 3: the count, in a small round bubble.
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                    decoration: BoxDecoration(
                      color: selected ? p.onPrimary.withValues(alpha: 0.2) : p.textMuted.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(IgongoRadius.pill),
                    ),
                    child: Text(
                      '$count',
                      style: context.text.labelSmall?.copyWith(color: foreground, fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
