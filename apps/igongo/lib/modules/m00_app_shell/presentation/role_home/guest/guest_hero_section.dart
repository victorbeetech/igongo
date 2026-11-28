// The guest home's banner section: reads the super admin's banners and shows
// them in the hero carousel. While loading it keeps the card's height; if the
// banners cannot be read it shows the empty card, so the layout never jumps.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/catalog/catalog.dart';
import '../../../../../shared/hotel/application/public_settings_providers.dart';
import '../../../../../shared/hotel/domain/hotel_content_item.dart';
import 'guest_hero_card.dart';

/// The card's height, the same as the carousel's, so the loading box keeps the layout still.
const _loadingHeight = 240.0;

/// Where a banner's button goes when the admin gave the banner no screen: the room list.
const _defaultBannerScreen = 'S67-01';

/// The banner carousel on the guest home, filled from the admin.
class GuestHeroSection extends ConsumerWidget {
  /// Creates the section for [screen] (used to open the banner's screen).
  const GuestHeroSection({super.key, required this.screen});

  /// The home screen's context, used to open screens.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the banners, from the public settings.
    final settings = ref.watch(publicSettingsProvider);
    return settings.when(
      // Step 2a: while loading, a box of the card's height, so nothing jumps.
      loading: () => const SizedBox(
        height: _loadingHeight,
        child: Center(child: CircularProgressIndicator()),
      ),
      // Step 2b: unreadable settings show the empty card; the person can pull to refresh the home later.
      error: (_, _) => GuestHeroCard(banners: const <HotelContentItem>[], onTap: _open),
      // Step 2c: the active banners from the admin.
      data: (data) => GuestHeroCard(banners: data.banners, onTap: _open),
    );
  }

  /// Opens the banner's screen, or the room list when the admin set none.
  void _open(HotelContentItem banner) {
    screen.open(banner.screen.isEmpty ? _defaultBannerScreen : banner.screen);
  }
}
