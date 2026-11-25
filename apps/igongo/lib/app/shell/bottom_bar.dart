// The bottom bar of the signed-in app: Home, Search, Alerts and Me.

import 'package:material_ui/material_ui.dart';

import '../navigation/open_target.dart';

/// The four bottom bar tabs. [currentId] is the screen showing.
class BottomBar extends StatelessWidget {
  /// Creates the bar for the screen [currentId].
  const BottomBar({super.key, required this.currentId});

  /// The screen number showing now.
  final String currentId;

  // Each tab: the screen it opens, its label and its icon.
  static const _tabs = [
    ('home', 'Home', Icons.home_outlined),
    ('S00-25', 'Search', Icons.search),
    ('S00-28', 'Alerts', Icons.notifications_none),
    ('S00-31', 'Me', Icons.person_outline),
  ];

  @override
  Widget build(BuildContext context) {
    // The role home is S00-21; any other screen keeps Home selected.
    final index = _tabs.indexWhere((t) => t.$1 == currentId).clamp(0, 3);
    return NavigationBar(
      selectedIndex: index,
      onDestinationSelected: (i) => openTarget(context, _tabs[i].$1),
      destinations: [for (final t in _tabs) NavigationDestination(icon: Icon(t.$3), label: t.$2)],
    );
  }
}
