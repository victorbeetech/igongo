// One venue in the Resort Venues row: its picture (a placeholder until it has
// one), its name, a short line and the order types it takes. The chosen venue
// has a red edge. Tapping a venue makes it the one the cart orders from.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/photo_slot.dart';

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
    // Step 1: the card's frame; the chosen venue gets a red edge.
    return Semantics(
      button: true,
      selected: selected,
      label: name,
      child: SizedBox(
        width: 176,
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
                // Step 2: the picture across the top.
                PhotoSlot(width: double.infinity, height: 72, asset: photo, icon: Icons.storefront_outlined),
                // Step 3: the name, the line under it, then the order-type tags.
                Padding(
                  padding: const EdgeInsets.all(IgongoSpace.sm),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text),
                      ),
                      Text(
                        detail,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: text.bodySmall?.copyWith(color: p.textMuted),
                      ),
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
                                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs, vertical: IgongoSpace.xxs),
                                  child: Text(
                                    b,
                                    style: text.labelSmall?.copyWith(color: p.onPrimaryContainer),
                                  ),
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
