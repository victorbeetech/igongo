// The hub layout: a module home or the guest home, as a grid of tiles, one
// per screen it opens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/icons/module_icons.dart';
import '../../ui/tile/home_tile.dart';
import '../parts/dialog_buttons.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';
import 'tile_grid.dart';

/// A grid of tiles that open the hub's screens.
class HubLayout extends StatelessWidget {
  /// Creates the hub for [screen].
  const HubLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) => ScreenListView(
    children: [
      PurposeText(screen.spec.purpose),
      Padding(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        child: TileGrid(
          children: [
            for (final id in screen.links)
              HomeTile(
                label: screen.nameOf(id),
                icon: ModuleIcons.of(id.substring(1, 3)),
                onTap: () => screen.open(id),
              ),
          ],
        ),
      ),
      DialogButtons(screen),
    ],
  );
}
