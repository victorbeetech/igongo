// A product card for guest grids: a cream rounded card with the picture on
// top, then the name in bold, a short description, the price in bold red and a
// small round + button. Every card has the same height so rows line up. Lay
// cards out with the shared TileGrid.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../photo/photo_slot.dart';

/// One product card.
class GuestProductCard extends StatelessWidget {
  /// Creates the card.
  const GuestProductCard({
    super.key,
    required this.name,
    required this.price,
    this.description,
    this.note,
    this.photo,
    this.onTap,
  });

  /// The product's name.
  final String name;

  /// The price as text, such as "UGX 5,000".
  final String price;

  /// A short line about the product, if any.
  final String? description;

  /// A small line (stars, "Not available"), if any.
  final String? note;

  /// The picture's address or asset path, or null for the placeholder.
  final String? photo;

  /// Called when the card or its + is tapped; null makes the card dim and inert.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final scale = MediaQuery.textScalerOf(context);
    // The text block is a fixed height (name, two description lines, price) that follows the text size.
    final textHeight = scale.scale(22) + scale.scale(18) * 2 + scale.scale(26) + IgongoSpace.xs * 3;
    return Semantics(
      button: onTap != null,
      label: '$name, $price',
      child: Opacity(
        opacity: onTap == null ? 0.5 : 1,
        child: Material(
          color: p.surfaceAlt,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(IgongoRadius.lg),
            side: BorderSide(color: p.border),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: SizedBox(
              height: 112 + textHeight + IgongoSpace.sm * 2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Step 1: the picture, full card width.
                  PhotoSlot(width: double.infinity, height: 112, asset: photo, icon: Icons.restaurant_outlined),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(IgongoSpace.sm),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: IgongoSpace.xs,
                        children: [
                          // Step 2: the name in bold, then a short description.
                          Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700, color: p.text),
                          ),
                          Text(
                            description ?? note ?? '',
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: context.text.bodySmall?.copyWith(color: p.textMuted),
                          ),
                          const Spacer(),
                          // Step 3: the price in bold red and the small + button.
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  price,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: context.text.titleSmall?.copyWith(
                                    fontWeight: FontWeight.w700,
                                    color: p.primaryText,
                                  ),
                                ),
                              ),
                              if (onTap != null)
                                CircleAvatar(
                                  radius: 12,
                                  backgroundColor: p.primary,
                                  foregroundColor: p.onPrimary,
                                  child: const Icon(Icons.add, size: 16),
                                ),
                            ],
                          ),
                        ],
                      ),
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
