// S00-21 Role home: built from the person's role at run time. The tiles come
// from the role (the super admin edits them in the layout editor), so a new
// role works without an app update. Guests get the redesigned home (the guest/ folder),
// whose stories, hero, quick actions and dish row follow the super admin's home settings.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/home_content/application/home_content_provider.dart';
import '../../../../shared/home_content/domain/home_content.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/screens/home/tile_grid.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/icons/module_icons.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/tile/home_tile.dart';
import 'area_card.dart';
import 'guest/guest_did_you_know.dart';
import 'guest/guest_dish_row.dart';
import 'guest/guest_hero_card.dart';
import 'guest/guest_quick_actions.dart';
import 'guest/guest_section_title.dart';
import 'guest/guest_status_strip.dart';
import 'guest/guest_stories_row.dart';
import 'guest/guest_top_bar.dart';
import 'guest_home_tiles.dart';
import 'guest_tile_list.dart';
import 'role_header.dart';
import 'role_shortcuts.dart';

/// The home screen of the current role.
class RoleHomeScreen extends ConsumerWidget {
  /// Creates the role home for [screen].
  const RoleHomeScreen(this.screen, {super.key});

  /// The role home's context, which carries the role.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = screen.role;
    final session = ref.watch(sessionProvider).valueOrNull;
    final name = session?.name;
    // Step 0: the guest home's content from the super admin's settings (the fallback until it loads).
    final home = ref.watch(homeContentProvider).valueOrNull ?? HomeContent.fallback;
    return ScreenListView(
      children: [
        // Step 1: the greeting. Guests get the top row (with search) and the status strip.
        if (role.isClient) ...[
          // Step 1a: the top row sits below the status bar and any notch, so it is never hidden under them.
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
              child: GuestTopBar(
                name: name,
                onBell: () => screen.open('S00-28'),
                onSearch: () => screen.open('S00-25'),
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, 0),
            child: GuestStatusStrip(),
          ),
        ] else
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: RoleHeader(role: role, name: name),
          ),
        // Step 1b: browsing needs no account; booking and ordering ask to sign in.
        if (session == null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: IgongoButton(
              label: 'Sign in or create an account',
              expand: true,
              onPressed: () => screen.open('S00-05'),
            ),
          ),
        if (role.isClient) ...[
          // Step 2: the stories row, then the featured stays. Each shows only when the super admin has switched it on and added items.
          if (home.showStories) GuestStoriesRow(stories: home.stories),
          if (home.showHero)
            Padding(
              padding: const EdgeInsets.only(top: IgongoSpace.sm),
              child: GuestHeroCard(slides: home.slides, onBook: () => screen.open('S67-01')),
            ),
          // Step 3: the quick actions, set by the super admin.
          if (home.showQuickActions)
            Padding(
              padding: const EdgeInsets.only(top: IgongoSpace.lg),
              child: GuestQuickActions(items: home.quickActions, onOpen: (id) => screen.open(id)),
            ),
          // Step 4: the dishes with a link to the full menu. The row hides itself when there are no dishes.
          if (home.restaurantOn)
            GuestDishRow(onFullMenu: () => screen.open('S62-01')),
          // Step 5: the areas of the hotel, two to a row, as the design shows.
          const GuestSectionTitle('Explore Igongo'),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: GuestTileList(
              columns: 2,
              children: [
                for (final tile in role.tiles)
                  if (!hiddenGuestTileIds.contains(tile.screenId))
                    AreaCard(
                      label: shortTileLabel(tile.label),
                      // The subtitle comes from the guest tile list, with a fallback for new tiles.
                      subtitle: guestTileSubtitles[tile.screenId] ?? guestTileSubtitleFallback,
                      icon: ModuleIcons.of(tile.screenId.substring(1, 3)),
                      onTap: () => screen.open(tile.screenId),
                    ),
              ],
            ),
          ),
          // Step 6: the heritage story card at the foot of the home.
          const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: GuestDidYouKnow()),
        ] else ...[
          // Staff: the role's tiles, then the staff shortcuts.
          const SectionHeader('Today'),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: TileGrid(
              children: [
                for (final tile in role.tiles)
                  HomeTile(
                    label: tile.label,
                    icon: ModuleIcons.of(tile.screenId.substring(1, 3)),
                    onTap: () => screen.open(tile.screenId),
                  ),
              ],
            ),
          ),
          const SectionHeader('Shortcuts'),
          for (final s in RoleShortcut.staff)
            IgongoListRow(
              title: s.label,
              leading: Icon(ModuleIcons.of(s.targetId.substring(1, 3))),
              onTap: () => screen.open(s.targetId),
            ),
        ],
      ],
    );
  }
}
