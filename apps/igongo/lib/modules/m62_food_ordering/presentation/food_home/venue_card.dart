// One venue in the Resort Venues row: its picture (a placeholder until it has
// one), a Featured tag slot, its name, a short line, the opening hours and the
// rating. Ratings, hours and the tag are placeholders until the API provides
// them. The chosen venue has a red edge. Tapping it makes it the cart's venue.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/photo_slot.dart';
import 'placeholder_value.dart';

/// The width of one venue card in the Resort Venues row.
const double kVenueCardWidth = 176;

/// The height of every venue card, so all cards in the row match whatever the text.
const double kVenueCardHeight = 170;

/// A venue card for the Resort Venues row.
class VenueCard extends StatelessWidget {
  /// Creates the card.
  const VenueCard({
    super.key,
    required this.name,
    required this.detail,
    required this.badges,
    required this.selected,
    this.photo,
    this.onTap,
  });

  /// The venue's name.
  final String name;

  /// A short line under the name.
  final String detail;

  /// Order-type words shown as small tags, such as "Dine-in".
  final List<String> badges;

  /// True for the venue the cart is using.
  final bool selected;

  /// The picture's address or asset path, or null for the placeholder.
  final String? photo;

  /// Called when the card is tapped.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    // Step 1: the card frame; the chosen venue gets a red edge.
    return Semantics(
      button: true,
      selected: selected,
      label: name,
      child: SizedBox(
        width: kVenueCardWidth,
        height: kVenueCardHeight,
        child: Material(
          color: p.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(IgongoRadius.lg),
            side: BorderSide(color: selected ? p.primary : p.border, width: selected ? 1.5 : 1),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Step 2: the picture across the top, with the Featured tag slot (placeholder).
                Stack(
                  children: [
                    PhotoSlot(width: double.infinity, height: 72, asset: photo, icon: Icons.storefront_outlined),
                    const Positioned(
                      top: IgongoSpace.xs,
                      left: IgongoSpace.xs,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: Color(0x66000000),
                          borderRadius: BorderRadius.all(Radius.circular(IgongoRadius.sm)),
                        ),
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                          child: PlaceholderValue(text: 'Featured —'),
                        ),
                      ),
                    ),
                  ],
                ),
                // Step 3: the name, the line under it, the hours and rating, then the order-type tags.
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
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text),
                            ),
                          ),
                          const PlaceholderValue(icon: Icons.star_outline),
                        ],
                      ),
                      Text(
                        detail,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.bodySmall?.copyWith(color: p.textMuted),
                      ),
                      const SizedBox(height: IgongoSpace.xxs),
                      const PlaceholderValue(icon: Icons.schedule, text: 'Hours —'),
                      if (badges.isNotEmpty) ...[
                        const SizedBox(height: IgongoSpace.xs),
                        Wrap(
                          spacing: IgongoSpace.xs,
                          runSpacing: IgongoSpace.xs,
                          children: [
                            for (final b in badges)
                              DecoratedBox(
                                decoration: BoxDecoration(
                                  color: p.primaryContainer,
                                  borderRadius: BorderRadius.circular(IgongoRadius.pill),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: IgongoSpace.xs,
                                    vertical: IgongoSpace.xxs,
                                  ),
                                  child: Text(b, style: text.labelSmall?.copyWith(color: p.onPrimaryContainer)),
                                ),
                              ),
                          ],
                        ),
                      ],
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
