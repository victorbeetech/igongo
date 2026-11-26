// The food shop entry on the guest home: a cream card with a red icon disc,
// the title, a food photo and a red arrow. It opens the food home (S62-01).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/photo/guest_photos.dart';
import '../../../../shared/ui/photo/photo_slot.dart';

/// A large, tappable card that opens the food shop.
class FoodShopCard extends StatelessWidget {
  /// Creates the food shop card; [onTap] opens the food home.
  const FoodShopCard({super.key, required this.onTap});

  /// Called when the card is tapped.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final radius = BorderRadius.circular(IgongoRadius.lg);
    return Semantics(
      button: true,
      label: 'Food shop: order delicious meals, delivered or dine-in',
      child: Material(
        color: p.surfaceAlt,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: radius, side: BorderSide(color: p.border)),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          // The whole card opens the food home.
          onTap: onTap,
          child: Row(
            children: [
              // Step 1: the red icon disc and the words.
              Padding(
                padding: const EdgeInsets.all(IgongoSpace.md),
                child: CircleAvatar(
                  radius: 24,
                  backgroundColor: p.primary,
                  foregroundColor: p.onPrimary,
                  child: const Icon(Icons.restaurant),
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Food shop', style: context.text.titleMedium?.copyWith(color: p.text)),
                    Text('Order delicious meals, delivered or dine-in', style: context.text.bodySmall),
                  ],
                ),
              ),
              // Step 2: the food photo with the red arrow over its corner.
              Stack(
                alignment: Alignment.centerRight,
                children: [
                  const PhotoSlot(width: 96, height: 80, asset: GuestPhotos.food, icon: Icons.ramen_dining_outlined),
                  Padding(
                    padding: const EdgeInsets.only(right: IgongoSpace.sm),
                    child: CircleAvatar(
                      radius: 14,
                      backgroundColor: p.primary,
                      foregroundColor: p.onPrimary,
                      child: const Icon(Icons.chevron_right, size: 20),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
