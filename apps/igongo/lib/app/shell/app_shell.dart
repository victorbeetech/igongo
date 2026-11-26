// Puts a screen inside the app frame: the red app bar with Search (and
// Preview for the super admin only), the menu, the bottom bar and the
// offline banner. There is no client view: one account is one kind.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/catalog/catalog.dart';
import '../../shared/layout/igongo_scaffold.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/session/session_controller.dart';
import '../../shared/states/view_state.dart';
import '../../shared/ui/banner/status_banner.dart';
import '../navigation/open_target.dart';
import '../preview/preview_sheet.dart';
import '../router/view_rules.dart';
import 'bottom_bar.dart';
import 'chrome_rules.dart';
import 'role_drawer.dart';

/// The app frame around one screen's [body].
class AppShell extends ConsumerWidget {
  /// Creates the frame for [spec].
  const AppShell({super.key, required this.spec, required this.body});

  /// The screen inside the frame.
  final ScreenSpec spec;

  /// The screen's content.
  final Widget body;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = PreferencesScope.of(context);
    final signedIn = ChromeRules.signedIn(spec);
    // Step 1b: the staff menu (drawer) is for staff and the super admin only; a guest sees the guest tabs.
    final session = ref.watch(sessionProvider).valueOrNull;
    final staffMenu = session != null && (session.isStaff || session.isSuperAdmin);
    // Step 1: the banner: offline when the preview says so.
    final banners = [
      if (prefs.state == ViewState.offline)
        StatusBanner(
          tone: BannerTone.offline,
          message: "You're offline. Saved items show; new ones sync later.",
          action: 'Sync status',
          onAction: () => openTarget(context, 'S00-40'),
        ),
    ];
    // Step 2: the frame, with the menu and bottom bar only once signed in.
    return IgongoScaffold(
      title: spec.id == 'S00-21' ? 'Home' : spec.name,
      banners: banners,
      body: body,
      drawer: signedIn && staffMenu ? const RoleDrawer() : null,
      bottomBar: signedIn ? BottomBar(currentId: spec.id) : null,
      actions: [
        // Search joins real accounts once it is live (docs/APP-WIRING.md).
        if (signedIn && ViewRules.previewOn(prefs, ref.watch(sessionProvider).valueOrNull))
          IconButton(tooltip: 'Search', icon: const Icon(Icons.search), onPressed: () => openTarget(context, 'S00-25')),
        // The Preview panel is the super admin's only (and design review builds').
        if (ViewRules.canPreview(prefs, ref.watch(sessionProvider).valueOrNull))
          IconButton(tooltip: 'Preview', icon: const Icon(Icons.tune), onPressed: () => showPreviewSheet(context)),
      ],
    );
  }
}
