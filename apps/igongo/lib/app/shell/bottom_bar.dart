// The bottom bar of the signed-in app: Home, My bookings (guests) and Me, or
// Home, the tabs the super admin set for the person's roles (module 3, up to
// three), and Me. Search and Alerts join the defaults once they are live.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/layout/application/layout_providers.dart';
import '../../shared/session/session_controller.dart';
import '../../shared/ui/icons/module_icons.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';

/// The bottom bar tabs. [currentId] is the screen showing.
class BottomBar extends ConsumerWidget {
  /// Creates the bar for the screen [currentId].
  const BottomBar({super.key, required this.currentId});

  /// The screen number showing now.
  final String currentId;

  // Each tab: the screen it opens, its label and its icon.
  static const _home = ('home', 'Home', Icons.home_outlined);
  static const _me = ('S00-31', 'Me', Icons.person_outline);
  static const _guestDefaults = [_home, ('S54-05', 'My bookings', Icons.receipt_long_outlined), _me];
  static const _staffDefaults = [_home, _me];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the layout's tabs (only screens the app knows), else the defaults.
    final index = CatalogIndex.instance;
    final set = (ref.watch(myLayoutProvider).valueOrNull?.tabs ?? const <String>[])
        .where(index.screens.containsKey)
        .take(3)
        .toList();
    final tabs = set.isEmpty
        ? ((ref.watch(sessionProvider).valueOrNull?.isStaff ?? false) ? _staffDefaults : _guestDefaults)
        : [_home, for (final id in set) (id, index.nameOf(id), ModuleIcons.of(index.screens[id]!.module)), _me];
    // Step 2: the role home is S00-21; any other screen keeps Home selected.
    final selected = tabs.indexWhere((t) => t.$1 == currentId).clamp(0, tabs.length - 1);
    return NavigationBar(
      selectedIndex: selected,
      onDestinationSelected: (i) => openTarget(context, tabs[i].$1),
      destinations: [for (final t in tabs) NavigationDestination(icon: Icon(t.$3), label: t.$2)],
    );
  }
}
