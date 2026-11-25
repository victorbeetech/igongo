// Puts a screen inside the app frame: the red app bar with Search and the
// preview button, the menu, the bottom bar and the offline and client view
// banners.

import 'package:material_ui/material_ui.dart';

import '../../shared/catalog/catalog.dart';
import '../../shared/layout/igongo_scaffold.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/states/view_state.dart';
import '../../shared/ui/banner/status_banner.dart';
import '../navigation/open_target.dart';
import '../preview/preview_sheet.dart';
import 'bottom_bar.dart';
import 'chrome_rules.dart';
import 'role_drawer.dart';

/// The app frame around one screen's [body].
class AppShell extends StatelessWidget {
  /// Creates the frame for [spec].
  const AppShell({super.key, required this.spec, required this.body});

  /// The screen inside the frame.
  final ScreenSpec spec;

  /// The screen's content.
  final Widget body;

  @override
  Widget build(BuildContext context) {
    final prefs = PreferencesScope.of(context);
    final signedIn = ChromeRules.signedIn(spec);
    // Step 1: the banners: offline when the preview says so, client view on the client home.
    final banners = [
      if (prefs.state == ViewState.offline)
        StatusBanner(
          tone: BannerTone.offline,
          message: "You're offline. Saved items show; new ones sync later.",
          action: 'Sync status',
          onAction: () => openTarget(context, 'S00-40'),
        ),
      if (spec.id == 'S00-23')
        StatusBanner(
          tone: BannerTone.clientView,
          message: 'You are seeing the app as a guest sees it.',
          action: 'Switch back',
          onAction: () => openTarget(context, 'home'),
        ),
    ];
    // Step 2: the frame, with the menu and bottom bar only once signed in.
    return IgongoScaffold(
      title: spec.name,
      banners: banners,
      body: body,
      drawer: signedIn ? const RoleDrawer() : null,
      bottomBar: signedIn ? BottomBar(currentId: spec.id) : null,
      actions: [
        if (signedIn)
          IconButton(tooltip: 'Search', icon: const Icon(Icons.search), onPressed: () => openTarget(context, 'S00-25')),
        IconButton(tooltip: 'Preview', icon: const Icon(Icons.tune), onPressed: () => showPreviewSheet(context)),
      ],
    );
  }
}
