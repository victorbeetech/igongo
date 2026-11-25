// The map layout: the site map, then the places on it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/map/map_placeholder.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/sample_rows.dart';
import '../parts/screen_list_view.dart';

/// A map or floor plan with the places on it.
class MapLayout extends StatelessWidget {
  /// Creates the map for [screen].
  const MapLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) => ScreenListView(
    children: [
      PurposeText(screen.spec.purpose),
      const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: MapPlaceholder()),
      SampleRows(mock: screen.module.mock, count: 3),
      LinkRows(screen),
      DialogButtons(screen),
    ],
  );
}
