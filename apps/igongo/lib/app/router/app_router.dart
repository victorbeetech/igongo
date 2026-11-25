// The app's routes, built from the screen inventory: one route per screen,
// the same address as on the web. `/` is the launch splash and `/home` is the
// role home. Nothing here is typed per screen.

import 'package:go_router/go_router.dart';

import '../catalog/catalog_index.dart';
import '../showcase/design_system_screen.dart';
import 'screen_page.dart';

/// Builds the router with a route for every screen of every module.
/// [initialLocation] is where the app opens; tests use it to open any screen.
GoRouter buildAppRouter({String initialLocation = '/'}) {
  final index = CatalogIndex.instance;
  // Step 1: the two fixed addresses, pointing at their inventory screens.
  final routes = <RouteBase>[
    GoRoute(
      path: '/',
      builder: (_, _) => ScreenPage(spec: index.screens['S00-01']!),
    ),
    GoRoute(
      path: '/home',
      builder: (_, _) => ScreenPage(spec: index.screens['S00-21']!),
    ),
    // The design system showcase, for review; it is not a screen of the inventory.
    GoRoute(path: '/design-system', builder: (_, _) => const DesignSystemScreen()),
  ];
  // Step 2: one route per screen; `:id` addresses take any record number.
  for (final screen in index.screens.values) {
    routes.add(
      GoRoute(
        path: screen.route,
        builder: (_, _) => ScreenPage(spec: screen),
      ),
    );
  }
  // Step 3: an unknown address shows the Not found screen.
  return GoRouter(
    initialLocation: initialLocation,
    routes: routes,
    errorBuilder: (_, _) => ScreenPage(spec: index.screens['S00-44']!),
  );
}
