// The hand-made screens of module 61 (Menus & Catalogue), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/menus_screen.dart';

/// Module 61's hand-made screens.
final m61Overrides = <String, ScreenOverride>{
  // S61-01 is Menus: each outlet, with how many dishes are on today's menu.
  'S61-01': (_, s) => MenusScreen(s),
};
