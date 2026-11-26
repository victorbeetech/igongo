// The guest home's slideshow of meals: each slide is a dish photo with its
// name and price; tapping a slide opens that dish. With no dishes yet it shows
// one food photo that opens the food home.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/photo/guest_photos.dart';
import '../../../shared/ui/photo/photo_slot.dart';
import '../../../shared/ui/slides/auto_slides.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../domain/menu_item.dart';
import 'item_page.dart';

/// An auto-sliding carousel of the first outlet's available dishes.
class MenuCarousel extends ConsumerWidget {
  /// Creates the carousel, [height] tall; [onEmptyTap] opens the food home when there are no dishes.
  const MenuCarousel({super.key, this.height = 160, this.onEmptyTap});

  /// The carousel's height.
  final double height;

  /// Called when the empty-state photo is tapped.
  final VoidCallback? onEmptyTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the first outlet's dishes that are on today.
    final outlet = ref.watch(outletsProvider).valueOrNull?.firstOrNull;
    final items = outlet == null
        ? const <MenuItem>[]
        : [
            for (final i in ref.watch(menuProvider(outlet.key)).valueOrNull ?? const <MenuItem>[])
              if (i.available && !i.isContainer) i,
          ];
    final p = context.palette;
    // Step 2: no dishes yet: one food photo that opens the food home.
    if (outlet == null || items.isEmpty) {
      return GestureDetector(
        onTap: onEmptyTap,
        child: PhotoSlot(width: double.infinity, height: height, asset: GuestPhotos.food, icon: Icons.restaurant),
      );
    }
    // Step 3: one slide per dish: photo, then the name and price over a dark strip.
    return AutoSlides(
      height: height,
      every: const Duration(seconds: 2),
      slides: [
        for (final item in items)
          Semantics(
            button: true,
            label: '${item.name}, ${ugx(item.price)}',
            child: InkWell(
              onTap: () {
                ref.read(cartProvider.notifier).useOutlet(outlet.key);
                openItemPage(context, item);
              },
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Dishes have no photo field yet: the shop's dish photo stands in.
                  PhotoSlot(width: double.infinity, height: height, asset: GuestPhotos.food, icon: Icons.restaurant),
                  Align(
                    alignment: Alignment.bottomLeft,
                    child: Container(
                      width: double.infinity,
                      color: p.primary.withValues(alpha: 0.85),
                      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
                      child: Text(
                        '${item.name} · ${ugx(item.price)}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: context.text.titleSmall?.copyWith(color: p.onPrimary),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
