// One dish in the Food tab's grid: the picture (a placeholder until the dish has
// one), a prep-time placeholder, the name, a star placeholder, a short
// description, the price and a + button. Tapping the card or + opens the dish
// page, where options are picked before it goes in the cart. Prep time and stars
// are placeholders until the API provides them.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/photo_slot.dart';
import 'placeholder_value.dart';

/// A dish card for the Food tab's grid.
class DishCard extends StatelessWidget {
  /// Creates the card.
  const DishCard({super.key, required this.name, required this.price, this.description, this.photo, this.onAdd});

  /// The dish's name.
  final String name;

  /// The price as text, such as "UGX 5,000".
  final String price;

  /// A short line about the dish, if any.
  final String? description;

  /// The picture's address or asset path, or null for the placeholder.
  final String? photo;

  /// Called when the card or its + is tapped; null makes the card inert.
  final VoidCallback? onAdd;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    final line = description ?? '';
    // Step 1: the card frame with a soft edge; the whole card is one tap target.
    return Semantics(
      button: onAdd != null,
      label: '$name, $price',
      child: Opacity(
        opacity: onAdd == null ? 0.5 : 1,
        child: Material(
          color: p.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(IgongoRadius.lg),
            side: BorderSide(color: p.border),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onAdd,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 2: the picture, with the prep-time placeholder on its corner.
                Stack(
                  children: [
                    PhotoSlot(width: double.infinity, height: 116, asset: photo, icon: Icons.restaurant_outlined),
                    Positioned(
                      right: IgongoSpace.xs,
                      bottom: IgongoSpace.xs,
                      child: DecoratedBox(
                        decoration: BoxDecoration(color: p.surface, borderRadius: BorderRadius.circular(IgongoRadius.sm)),
                        child: const Padding(
                          padding: EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                          child: PlaceholderValue(icon: Icons.timer_outlined, text: '— min'),
                        ),
                      ),
                    ),
                  ],
                ),
                // Step 3: name with a star placeholder, description, then the price with the + button.
                Padding(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              name,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text),
                            ),
                          ),
                          const PlaceholderValue(icon: Icons.star_outline),
                        ],
                      ),
                      if (line.isNotEmpty) ...[
                        const SizedBox(height: IgongoSpace.xxs),
                        Text(
                          line,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: text.bodySmall?.copyWith(color: p.textMuted),
                        ),
                      ],
                      const SizedBox(height: IgongoSpace.sm),
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              price,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.primaryText),
                            ),
                          ),
                          IconButton(
                            tooltip: 'Add $name',
                            onPressed: onAdd,
                            icon: const Icon(Icons.add, size: 18),
                            style: IconButton.styleFrom(
                              backgroundColor: p.primary,
                              foregroundColor: p.onPrimary,
                              disabledBackgroundColor: p.border,
                              minimumSize: const Size.square(IgongoTouch.minimum),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
