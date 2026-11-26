// The signed-in person's layout from `GET /api/layout/me` (module 3): menu
// order, bottom tabs, home tiles and the client view switch, combined from
// all their roles by the API. Nothing is hard-coded in the app.

import '../../api/api_client.dart';

/// One person's layout.
class MyLayout {
  /// Creates a layout.
  const MyLayout({required this.menu, required this.tabs, required this.tiles, required this.canSwitchToClient});

  /// Reads a layout from the API.
  factory MyLayout.fromJson(Json j) => MyLayout(
    menu: [for (final k in j['menu'] as List<dynamic>) k as String],
    tabs: [for (final k in j['tabs'] as List<dynamic>) k as String],
    tiles: [for (final k in j['tiles'] as List<dynamic>) k as String],
    canSwitchToClient: j['canSwitchToClient'] as bool? ?? false,
  );

  /// Module keys in menu order; `*` stands for every other module.
  final List<String> menu;

  /// Bottom bar screen IDs.
  final List<String> tabs;

  /// Home tiles in order.
  final List<String> tiles;

  /// True when the client view switch shows.
  final bool canSwitchToClient;

  /// True when the menu reaches every module.
  bool get everything => menu.contains('*');

  /// Where module [key] sits in the menu, or null when it is not in it.
  int? placeOf(String key) {
    final i = menu.indexOf(key);
    if (i >= 0) return i;
    return everything ? menu.length : null;
  }
}
