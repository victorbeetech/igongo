// S00-21 Role home: built from the person's role at run time. The tiles come
// from the role (the super admin edits them in the layout editor), so a new
// role works without an app update.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/screens/home/tile_grid.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/icons/module_icons.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/tile/home_tile.dart';
import 'area_card.dart';
import 'food_shop_card.dart';
import 'guest_header.dart';
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
    return ScreenListView(
      children: [
        // Step 1: the greeting. Guests get the red header with the logo, bell and hotel photo.
        if (role.isClient)
          GuestHeader(name: name, onBell: () => screen.open('S00-28'))
        else
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
        // Step 1c: guests get the food shop as a large card first; it opens the food home.
        if (role.isClient)
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.lg, IgongoSpace.lg, 0),
            child: FoodShopCard(onTap: () => screen.open('S62-01')),
          ),
        // Step 2: the role's tiles (no made-up counts: each screen shows its own live numbers).
        SectionHeader(role.isClient ? 'Explore Igongo' : 'Today'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: role.isClient
              // Guests: same-size one-line area cards, one column on a phone.
              ? GuestTileList(
                  children: [
                    for (final tile in role.tiles)
                      if (!hiddenGuestTileIds.contains(tile.screenId))
                        AreaCard(
                          label: shortTileLabel(tile.label),
                          icon: ModuleIcons.of(tile.screenId.substring(1, 3)),
                          onTap: () => screen.open(tile.screenId),
                        ),
                  ],
                )
              : TileGrid(
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
        // Step 3: the staff shortcuts; guests see the client app instead.
        if (!role.isClient) ...[
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
