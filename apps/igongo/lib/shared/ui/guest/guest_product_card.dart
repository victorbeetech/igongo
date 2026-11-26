// A product tile for guest grids: a picture, the price under it, then the
// name. A dimmed tile cannot be tapped (not available today). Lay tiles out
// with the shared TileGrid.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../photo/photo_slot.dart';

/// One product tile.
class GuestProductCard extends StatelessWidget {
  /// Creates the tile.
  const GuestProductCard({super.key, required this.name, required this.price, this.note, this.photo, this.onTap});

  /// The product's name.
  final String name;

  /// The price as text, such as "UGX 5,000".
  final String price;

  /// A small line under the name (stars, "Not available"), if any.
  final String? note;

  /// The picture's address or asset path, or null for the placeholder.
  final String? photo;

  /// Called when tapped; null makes the tile dim and inert.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: onTap != null,
      label: '$name, $price',
      child: Opacity(
        opacity: onTap == null ? 0.5 : 1,
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          onTap: onTap,
          // Every tile has the same height (text sizes included), so rows line up.
          child: SizedBox(
            height: 112 + IgongoSpace.xs * 3 + MediaQuery.textScalerOf(context).scale(72),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: IgongoSpace.xs,
              children: [
                // Step 1: the picture, full tile width.
                ClipRRect(
                  borderRadius: BorderRadius.circular(IgongoRadius.lg),
                  child: PhotoSlot(width: double.infinity, height: 112, asset: photo, icon: Icons.restaurant_outlined),
                ),
                // Step 2: price under the picture, then the name and note.
                Text(price, style: context.text.titleMedium?.copyWith(color: p.text)),
                Text(name, maxLines: 2, overflow: TextOverflow.ellipsis, style: context.text.bodySmall),
                if (note != null) Text(note!, style: context.text.labelSmall?.copyWith(color: p.textMuted)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
