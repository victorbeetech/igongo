// Draws one route: finds its screen, builds its ScreenContext, picks the
// hand-made screen or the shared layout, applies the previewed state and puts
// it in the app frame. Opens a `?dialog=` from the address after the first frame.

import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/catalog/catalog.dart';
import '../../shared/preferences/preferences.dart';
import '../../shared/screens/platform/web_only_layout.dart';
import '../../shared/screens/screen_layout.dart';
import '../../shared/states/state_view.dart';
import '../../shared/states/view_state.dart';
import '../catalog/catalog_index.dart';
import '../navigation/open_target.dart';
import '../shell/app_shell.dart';
import '../shell/chrome_rules.dart';

/// The page for one screen of the inventory.
class ScreenPage extends StatefulWidget {
  /// Creates the page for [spec].
  const ScreenPage({super.key, required this.spec});

  /// The screen to draw.
  final ScreenSpec spec;

  @override
  State<ScreenPage> createState() => _ScreenPageState();
}

class _ScreenPageState extends State<ScreenPage> {
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
    final state = prefs.state;
    final role = index.roles[prefs.roleKey] ?? index.defaultRole;
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
    } else {
      body = override?.call(context, screen) ?? screenLayout(screen);
    }

    // Step 3: full-screen pages draw themselves; everything else goes in the app frame.
    return ChromeRules.fullScreen(spec) ? body : AppShell(spec: spec, body: body);
  }
}
