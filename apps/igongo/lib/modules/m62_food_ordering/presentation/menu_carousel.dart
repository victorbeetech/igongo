// The guest home's slideshow of today's dishes: one slide at a time, moving
// on by itself every 2 seconds. Tapping a slide opens that dish. With no
// dishes yet it shows the banner placeholder (GuestPhotos.banner).

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/format/ugx.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/photo/guest_photos.dart';
import '../../../shared/ui/photo/photo_slot.dart';
import '../application/cart_controller.dart';
import '../application/orders_providers.dart';
import '../domain/menu_item.dart';
import 'item_page.dart';

/// An auto-sliding carousel of the first outlet's available dishes.
class MenuCarousel extends ConsumerStatefulWidget {
  /// Creates the carousel, [height] logical pixels tall.
  const MenuCarousel({super.key, this.height = 140});

  /// The carousel's height.
  final double height;

  @override
  ConsumerState<MenuCarousel> createState() => _MenuCarouselState();
}

class _MenuCarouselState extends ConsumerState<MenuCarousel> {
  /// How long each slide stays.
  static const _every = Duration(seconds: 2);

  final _page = PageController();
  Timer? _timer;

  /// How many slides there are now (set while building).
  int _count = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: every 2 seconds move to the next slide, back to the first after the last.
    _timer = Timer.periodic(_every, (_) {
      if (_count < 2 || !_page.hasClients) return;
      final next = ((_page.page?.round() ?? 0) + 1) % _count;
      _page.animateToPage(next, duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _page.dispose();
    super.dispose();
  }

  /// Opens [item]'s page (preview, add-ons, note) for [outlet].
  void _open(String outlet, MenuItem item) {
    ref.read(cartProvider.notifier).useOutlet(outlet);
    openItemPage(context, item);
  }

  @override
  Widget build(BuildContext context) {
    // Step 2: the first outlet's dishes that are on today (none yet shows the banner).
    final outlet = ref.watch(outletsProvider).valueOrNull?.firstOrNull;
    final items = outlet == null
        ? const <MenuItem>[]
        : [
            for (final i in ref.watch(menuProvider(outlet.key)).valueOrNull ?? const <MenuItem>[])
              if (i.available && !i.isContainer) i,
          ];
    _count = items.length;
    if (outlet == null || items.isEmpty) {
      return PhotoSlot(
        width: double.infinity,
        height: widget.height,
        asset: GuestPhotos.banner,
        icon: Icons.landscape_outlined,
      );
    }
    final p = context.palette;
    return SizedBox(
      height: widget.height,
      child: PageView.builder(
        controller: _page,
        itemCount: items.length,
        itemBuilder: (_, i) => Semantics(
          button: true,
          label: '${items[i].name}, ${ugx(items[i].price)}',
          child: Material(
            color: p.surfaceAlt,
            child: InkWell(
              onTap: () => _open(outlet.key, items[i]),
              child: Row(
                children: [
                  PhotoSlot(width: widget.height, height: widget.height, icon: Icons.restaurant_outlined),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(IgongoSpace.md),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: IgongoSpace.xs,
                        children: [
                          Text(
                            items[i].name,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: context.text.titleMedium,
                          ),
                          Text(ugx(items[i].price), style: context.text.titleSmall?.copyWith(color: p.primaryText)),
                          Text('Tap to order', style: context.text.bodySmall),
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
