// The frame around every app screen: the red app bar with the title, the
// banners under it (offline, client view), the body and the bottom bar.

import 'package:material_ui/material_ui.dart';

import '../ui/banner/status_banner.dart';

/// The Igongo screen frame.
class IgongoScaffold extends StatelessWidget {
  /// Creates the frame around [body].
  const IgongoScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions = const [],
    this.banners = const [],
    this.bottomBar,
    this.drawer,
    this.floatingAction,
    this.showAppBar = true,
    this.isTab = false,
  });

  /// The title in the app bar.
  final String title;

  /// The screen content.
  final Widget body;

  /// Icon buttons at the right of the app bar.
  final List<Widget> actions;

  /// Banners under the app bar, top to bottom.
  final List<StatusBanner> banners;

  /// The bottom navigation bar, if the screen has one.
  final Widget? bottomBar;

  /// The side menu, if the screen has one.
  final Widget? drawer;

  /// A floating button, such as the preview panel button.
  final Widget? floatingAction;

  /// False hides the red app bar (the guest home draws its own header in that spot).
  final bool showAppBar;

  /// True for a bottom-bar tab screen: no Back arrow (the bar is how people move
  /// between tabs). Only pushed pages show one. A side menu button still shows.
  final bool isTab;

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: showAppBar
        ? AppBar(
            title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
            actions: actions,
          )
        : null,
    drawer: drawer,
    bottomNavigationBar: bottomBar,
    floatingActionButton: floatingAction,
    // The banners stay at the top while the body scrolls under them.
    body: Column(
      children: [
        ...banners,
        Expanded(child: body),
      ],
    ),
  );
}
