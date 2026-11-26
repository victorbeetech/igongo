// The bottom bar of the signed-in app.
// Guests: Home, Food, Bookings, Cart (with the item count) and Me.
// Staff: Home, the tabs the super admin set for the person's roles (up to
// three), and Me.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../modules/m62_food_ordering/application/cart_controller.dart';
import '../../shared/layout/application/layout_providers.dart';
import '../../shared/session/session_controller.dart';
import '../../shared/theme/theme.dart';
import '../../shared/ui/bar/wavy_top_clipper.dart';
import '../../shared/ui/icons/module_icons.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';

/// One tab: the screen it opens, its label and its icon.
typedef _Tab = (String, String, IconData);

/// The bottom bar tabs. [currentId] is the screen showing.
class BottomBar extends ConsumerWidget {
  /// Creates the bar for the screen [currentId].
  const BottomBar({super.key, required this.currentId});

  /// The screen number showing now.
  final String currentId;

  static const _home = ('home', 'Home', Icons.home_outlined);
  static const _me = ('S00-31', 'Me', Icons.person_outline);
  static const _food = ('S62-01', 'Food', Icons.restaurant_menu_outlined);
  static const _bookings = ('S54-05', 'Bookings', Icons.event_available_outlined);
  static const _cart = ('S62-04', 'Cart', Icons.shopping_cart_outlined);

  /// The guest tabs, always the same.
  static const _guestTabs = <_Tab>[_home, _food, _bookings, _cart, _me];

  /// Food screens that keep the Food tab lit (the order flow, not the cart).
  static const _foodFlow = {'S62-02', 'S62-03', 'S62-05', 'S62-06', 'S62-07', 'S62-08', 'S62-16'};

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider).valueOrNull;
    final isGuest = session != null && !session.isStaff && !session.isSuperAdmin;
    final tabs = isGuest ? _guestTabs : _staffTabs(ref);
    // The cart's badge: how many dishes are in it.
    final cartCount = ref.watch(cartProvider).lines.fold(0, (n, l) => n + l.quantity);
    // Step 1: a food screen keeps the Food tab lit; any other screen not in the bar keeps Home.
    final activeId = _foodFlow.contains(currentId) ? _food.$1 : currentId;
    final selected = tabs.indexWhere((t) => t.$1 == activeId).clamp(0, tabs.length - 1);
    final bar = NavigationBar(
      selectedIndex: selected,
      onDestinationSelected: (i) => openTab(context, tabs[i].$1),
      destinations: [
        for (final t in tabs)
          NavigationDestination(
            // Step 2: the Cart tab carries the count of dishes in it.
            icon: t.$1 == _cart.$1
                ? Badge(isLabelVisible: cartCount > 0, label: Text('$cartCount'), child: Icon(t.$3))
                : Icon(t.$3),
            label: t.$2,
          ),
      ],
    );
    // Step 3: guests get the dark red bar (cream pill on the open tab); staff keep the plain one.
    if (!isGuest) return bar;
    final p = context.palette;
    final text = Theme.of(context).textTheme.labelSmall;
    return ClipPath(
      clipper: const WavyTopClipper(),
      // The wave needs a little room above the tabs; the page's cream shows above it.
      child: ColoredBox(
        color: p.primaryDark,
        child: Padding(
          padding: const EdgeInsets.only(top: 10),
          child: Theme(
            data: Theme.of(context).copyWith(
              navigationBarTheme: NavigationBarThemeData(
                backgroundColor: p.primaryDark,
                indicatorColor: p.brandCream,
                height: 64,
                labelTextStyle: WidgetStateProperty.resolveWith(
                  // Labels sit on the dark red bar, so both states are white (the open tab bolder).
                  (s) => text?.copyWith(
                    color: p.onPrimary,
                    fontWeight: s.contains(WidgetState.selected) ? FontWeight.w700 : FontWeight.w400,
                  ),
                ),
                iconTheme: WidgetStateProperty.resolveWith(
                  (s) => IconThemeData(color: s.contains(WidgetState.selected) ? p.primary : p.onPrimary),
                ),
              ),
            ),
            child: bar,
          ),
        ),
      ),
    );
  }

  /// The staff tabs: the layout's tabs (only screens the app knows), else the defaults.
  static List<_Tab> _staffTabs(WidgetRef ref) {
    final index = CatalogIndex.instance;
    final set = (ref.watch(myLayoutProvider).valueOrNull?.tabs ?? const <String>[])
        .where(index.screens.containsKey)
        .take(3)
        .toList();
    if (set.isEmpty) return const [_home, _me];
    return [_home, for (final id in set) (id, index.nameOf(id), ModuleIcons.of(index.screens[id]!.module)), _me];
  }
}

/// The screen numbers the bottom bar opens for the signed-in person (the tab
/// screens). The role home counts as S00-21. The app shell uses this so a tab
/// never shows a Back arrow; only pushed pages do.
List<String> bottomBarTabIds(WidgetRef ref) {
  final session = ref.watch(sessionProvider).valueOrNull;
  final isGuest = session != null && !session.isStaff && !session.isSuperAdmin;
  final tabs = isGuest ? BottomBar._guestTabs : BottomBar._staffTabs(ref);
  return [for (final t in tabs) t.$1 == 'home' ? 'S00-21' : t.$1];
}
