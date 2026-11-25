// Fast lookups over the generated catalogue: a screen by number or route, a
// dialog by number or slug, a role by key. Built once when the app starts.

import '../../shared/catalog/catalog.dart';
import 'catalog.g.dart';

/// Looks up screens, dialogs, modules and roles from the generated catalogue.
class CatalogIndex {
  CatalogIndex._() {
    // Step 1: index every screen and dialog of every module.
    for (final module in allModules) {
      modules[module.code] = module;
      for (final screen in module.screens) {
        screens[screen.id] = screen;
      }
      for (final dialog in module.dialogs) {
        dialogs[dialog.id] = dialog;
        dialogsBySlug[dialog.slug] = dialog;
      }
    }
    // Step 2: index the roles by key.
    for (final role in allRoles) {
      roles[role.key] = role;
    }
  }

  /// The one shared index.
  static final instance = CatalogIndex._();

  /// Modules by code.
  final modules = <String, ModuleSpec>{};

  /// Screens by number.
  final screens = <String, ScreenSpec>{};

  /// Dialogs by number.
  final dialogs = <String, DialogSpec>{};

  /// Dialogs by their `?dialog=` slug.
  final dialogsBySlug = <String, DialogSpec>{};

  /// Roles by key.
  final roles = <String, RoleSpec>{};

  /// The module a screen belongs to.
  ModuleSpec moduleOf(ScreenSpec screen) => modules[screen.module]!;

  /// The route to push for a screen, with a sample record number in place of `:id`.
  String locationOf(ScreenSpec screen) => screen.route.replaceAll(':id', 'sample');

  /// The name of a screen or dialog by number, or "Home" for the role home.
  String nameOf(String id) => screens[id]?.name ?? dialogs[id]?.name ?? 'Home';

  /// The first screen of a module, which its menu entry opens.
  ScreenSpec entryOf(ModuleSpec module) =>
      module.screens.firstWhere((s) => s.inApp, orElse: () => module.screens.first);

  /// The role used when none is chosen yet.
  RoleSpec get defaultRole => roles['super-admin']!;
}
