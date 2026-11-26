// Draws one route: finds its screen, builds its ScreenContext, picks the
// hand-made screen or the shared layout, applies the previewed state and puts
// it in the app frame. Opens a `?dialog=` from the address after the first frame.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/catalog/catalog.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/screens/platform/not_ready_layout.dart';
import '../../shared/screens/platform/web_only_layout.dart';
import '../../shared/screens/screen_layout.dart';
import '../../shared/states/state_view.dart';
import '../../shared/session/session_controller.dart';
import '../../shared/states/view_state.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';
import '../shell/app_shell.dart';
import '../shell/chrome_rules.dart';
import 'view_rules.dart';

/// The page for one screen of the inventory.
class ScreenPage extends ConsumerStatefulWidget {
  /// Creates the page for [spec].
  const ScreenPage({super.key, required this.spec});

  /// The screen to draw.
  final ScreenSpec spec;

  @override
  ConsumerState<ScreenPage> createState() => _ScreenPageState();
}

/// Shared layouts that show only links, never sample records, so real accounts may see them.
const _honestWithoutData = {ScreenKind.home, ScreenKind.result};

class _ScreenPageState extends ConsumerState<ScreenPage> {
  @override
  void initState() {
    super.initState();
    // A link such as /settings?dialog=sign-out-confirmation opens that dialog on arrival.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final slug = GoRouterState.of(context).uri.queryParameters['dialog'];
      final dialog = slug == null ? null : CatalogIndex.instance.dialogsBySlug[slug];
      if (dialog != null) openTarget(context, dialog.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: everything the layouts need for this screen.
    final index = CatalogIndex.instance;
    final spec = widget.spec;
    final module = index.moduleOf(spec);
    final prefs = PreferencesScope.of(context);
    // The real person's role and state; the preview choices only for the super admin.
    final session = ref.watch(sessionProvider).valueOrNull;
    final state = ViewRules.state(prefs, session);
    final role = ViewRules.role(prefs, session);
    final screen = ScreenContext(
      spec: spec,
      module: module,
      state: state,
      role: role,
      nameOf: index.nameOf,
      open: (id) => openTarget(context, id),
    );

    // Step 2: the content: web-only notice, the previewed state, a hand-made screen or the shared layout.
    final override = module.overrides[spec.id];
    final Widget body;
    if (!spec.inApp) {
      body = WebOnlyLayout(screen);
    } else if (state != ViewState.normal && state != ViewState.offline && !ChromeRules.fullScreen(spec)) {
      body = StateView(
        state: state,
        screenName: spec.name,
        onBack: () => openTarget(context, 'home'),
        onRetry: () => PreferencesScope.of(context).state = ViewState.normal,
      );
    } else if (override != null) {
      body = override(context, screen);
    } else if (ViewRules.previewOn(prefs, session) || _honestWithoutData.contains(spec.kind)) {
      body = screenLayout(screen);
    } else {
      // A real account never sees sample records: an honest notice instead.
      body = NotReadyLayout(screen);
    }

    // Step 3: full-screen pages draw themselves; everything else goes in the app frame.
    return ChromeRules.fullScreen(spec) ? body : AppShell(spec: spec, body: body);
  }
}
