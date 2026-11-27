// The guest home, as in the approved design: greeting, "Explore Igongo" in four
// columns, "From our kitchen" slides, then "Today at Igongo" below the fold.
// The staff role home is a separate layout in role_home_screen.dart.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/screens/home/tile_grid.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/icons/module_icons.dart';
import '../../../../shared/ui/section/section_header.dart';
import 'area_card.dart';
import 'guest_areas.dart';
import 'guest_greeting.dart';
import 'kitchen_slides.dart';
import 'today_placeholder.dart';

/// The home a guest sees: the hotel's areas, the kitchen and today's news.
class GuestHomeView extends ConsumerWidget {
  /// Creates the guest home for [screen].
  const GuestHomeView(this.screen, {super.key});

  /// The home's context, used to open each area.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider).valueOrNull;
    return ScreenListView(
      children: [
        // Step 1: the greeting, with the first name when signed in.
        GuestGreeting(name: session?.name),
        // Step 1b: booking and ordering ask to sign in, so signed-out guests see the button.
        if (session == null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: IgongoButton(
              label: 'Sign in or create an account',
              expand: true,
              onPressed: () => screen.open('S00-05'),
            ),
          ),
        // Step 2: the eight areas, four across, each one a card that opens it.
        const SectionHeader('Explore Igongo'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: TileGrid(
            columns: 4,
            children: [
              for (final area in guestAreas)
                AreaCard(
                  label: area.label,
                  icon: ModuleIcons.of(area.screenId.substring(1, 3)),
                  onTap: () => screen.open(area.screenId),
                ),
            ],
          ),
        ),
        // Step 3: the dishes, one card at a time, with a link to the full menu.
        SectionHeader('From our kitchen', action: 'Full menu', onAction: () => screen.open('S62-01')),
        KitchenSlides(screen),
        // Step 4: today's placeholder sits below, so it appears only once the guest scrolls.
        const Padding(
          padding: EdgeInsets.all(IgongoSpace.lg),
          child: TodayPlaceholder(),
        ),
      ],
    );
  }
}
