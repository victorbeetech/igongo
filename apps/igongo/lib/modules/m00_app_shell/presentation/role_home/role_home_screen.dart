// S00-21 Role home: built from the person's role at run time. The tiles come
// from the role (the super admin edits them in the layout editor), so a new
// role works without an app update.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/screens/home/tile_grid.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/ui/icons/module_icons.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/tile/home_tile.dart';
import 'role_header.dart';
import 'role_shortcuts.dart';

/// The home screen of the current role.
class RoleHomeScreen extends StatelessWidget {
  /// Creates the role home for [screen].
  const RoleHomeScreen(this.screen, {super.key});

  /// The role home's context, which carries the role.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final role = screen.role;
    return ScreenListView(
      children: [
        // Step 1: the greeting and role switch.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: RoleHeader(role: role, onSwitch: () => screen.open('S00-22')),
        ),
        // Step 2: the role's tiles; a sample count on every other tile.
        const SectionHeader('Today'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: TileGrid(
            children: [
              for (final (i, tile) in role.tiles.indexed)
                HomeTile(
                  label: tile.label,
                  icon: ModuleIcons.of(tile.screenId.substring(1, 3)),
                  count: i.isEven ? '${(i * 3 + 2) % 9 + 1}' : null,
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
