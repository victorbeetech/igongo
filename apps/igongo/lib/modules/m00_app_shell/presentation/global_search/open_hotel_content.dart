// Opens the screen behind a curated finding or trending experience. An item the
// admin linked to no screen opens the food menu instead, the default in the app.

import 'package:material_ui/material_ui.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/catalog/catalog_index.dart';
import '../../../../shared/hotel/domain/hotel_content_item.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// The screen a finding or experience opens when the admin gave it none: the menu.
const String _defaultContentScreen = 'S62-01';

/// Opens [item]'s screen, or tells the guest when that screen is not in the app yet.
void openHotelContent(BuildContext context, HotelContentItem item) {
  // Step 1: use the admin's screen, or the menu when none is set.
  final code = item.screen.isEmpty ? _defaultContentScreen : item.screen;
  // Step 2: look the screen up in the catalogue; a missing one is told, not opened blank.
  final target = CatalogIndex.instance.screens[code];
  if (target == null) {
    showIgongoToast(context, 'This item is not linked to a screen yet.');
    return;
  }
  // Step 3: open it.
  context.push(CatalogIndex.instance.locationOf(target));
}
