// The guest home's slideshow of meals: three dish pictures in a stack (no text),
// the middle one in front; tapping the front one opens that dish. With no dishes yet it shows
// one food photo that opens the food home.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/ui/photo/guest_photos.dart';
import '../../../shared/ui/photo/photo_slot.dart';
import '../../../shared/ui/slides/stacked_slides.dart';
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
    // Step 2: no dishes yet: one food photo that opens the food home.
    if (outlet == null || items.isEmpty) {
      return GestureDetector(
        onTap: onEmptyTap,
        child: PhotoSlot(width: double.infinity, height: height, asset: GuestPhotos.food, icon: Icons.restaurant),
      );
    }
    // Step 3: a stack of dish pictures (no text): the front card opens its dish when tapped.
    return StackedSlides(
      height: height,
      slides: [
        for (final item in items)
          StackedSlide(
            label: '${item.name}, ${ugx(item.price)}',
            onTap: () {
              ref.read(cartProvider.notifier).useOutlet(outlet.key);
              openItemPage(context, item);
            },
            // Dishes have no photo field yet: the shop's dish photo stands in.
            child: PhotoSlot(width: double.infinity, height: height, asset: GuestPhotos.food, icon: Icons.restaurant),
          ),
      ],
    );
  }
}
