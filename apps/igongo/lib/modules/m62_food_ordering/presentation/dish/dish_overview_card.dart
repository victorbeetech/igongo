// The card under the photo: the menu section, the kitchen, the serves count,
// the dish name, the price with calories, the description, dietary tags and
// allergens. Words and prices come from the menu API; the kitchen, serves and
// calories are placeholders until the menu has them.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/key_words.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/menu_item.dart';
import 'dish_badge.dart';
import 'dish_placeholder.dart';

/// The dish's name, price, description and tags.
class DishOverviewCard extends StatelessWidget {
  /// Creates the card for [item].
  const DishOverviewCard({super.key, required this.item});

  /// The dish shown.
  final MenuItem item;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final text = context.text;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: palette.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the menu section in the red accent, with the serves count on the right.
          Row(
            children: [
              Expanded(
                child: Text(
                  item.section.toUpperCase(),
                  style: text.labelSmall?.copyWith(color: palette.primaryText, letterSpacing: 1.2),
                ),
              ),
              const SizedBox(width: IgongoSpace.sm),
              DishBadge(label: 'Serves $dishNoValue', background: palette.surfaceAlt, foreground: palette.textMuted),
            ],
          ),
          // Step 2: the kitchen, a placeholder until the menu names it.
          Text('Kitchen: $dishComingSoon', style: text.labelSmall?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          // Step 3: the name, in the brand face.
          Text(item.name, style: text.displaySmall),
          const SizedBox(height: IgongoSpace.sm),
          // Step 4: the price, then the calories (a placeholder until the menu has them).
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: IgongoSpace.sm,
            children: [
              Text(
                ugx(item.price),
                style: text.titleLarge?.copyWith(color: palette.primaryText, fontWeight: FontWeight.w700),
              ),
              Text('• approx. $dishNoValue kcal', style: text.labelLarge?.copyWith(color: palette.textMuted)),
            ],
          ),
          // Step 5: the description, when the restaurant wrote one.
          if (item.description case final d? when d.isNotEmpty) ...[
            const SizedBox(height: IgongoSpace.md),
            Text(d, style: text.bodyMedium?.copyWith(color: palette.textMuted)),
          ],
          // Step 6: dietary tags and allergens, with a divider above them.
          if (item.tags.isNotEmpty || item.allergens.isNotEmpty) ...[
            const SizedBox(height: IgongoSpace.md),
            Divider(height: 1, color: palette.border),
            const SizedBox(height: IgongoSpace.md),
            Wrap(
              spacing: IgongoSpace.sm,
              runSpacing: IgongoSpace.sm,
              children: [
                for (final tag in item.tags)
                  DishBadge(
                    label: keyWords(tag),
                    background: palette.surfaceAlt,
                    foreground: palette.text,
                    border: palette.border,
                  ),
                if (item.allergens.isNotEmpty)
                  DishBadge(
                    label: 'Contains: ${item.allergens.map(keyWords).join(', ')}',
                    icon: Icons.warning_amber_rounded,
                    background: palette.error.withValues(alpha: 0.1),
                    foreground: palette.error,
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
