// The key screens for visual tests: the first app screen of each of the ten
// layout kinds (home, list, form and so on), so every shared layout is covered
// without picking screens by hand. Taken from the catalogue, so it follows the
// inventory when screens change. Full-screen start-up screens (the splash) are
// left out: they have no app frame to test.

import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/shell/chrome_rules.dart';
import 'package:igongo/shared/catalog/catalog.dart';

/// One screen per layout kind, in the order of [ScreenKind].
List<ScreenSpec> keyScreens() {
  final screens = CatalogIndex.instance.screens.values.where(
    (s) => s.surfaces.contains(Surface.app) && !ChromeRules.fullScreen(s),
  );
  return [for (final kind in ScreenKind.values) ?screens.where((s) => s.kind == kind).firstOrNull];
}
