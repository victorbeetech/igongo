// The root of the app: the Riverpod scope (the session and every live
// screen's data), the Igongo themes in light and dark, the person's text
// size on top of the phone's own, and the router.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../shared/preferences/preferences.dart';
import '../shared/theme/theme.dart';
import 'router/app_router.dart';

/// The Igongo app.
class IgongoApp extends StatefulWidget {
  /// Creates the app.
  const IgongoApp({super.key, this.initialLocation = '/', this.preferences, this.overrides = const []});

  /// Where the app opens. Tests open any screen with it.
  final String initialLocation;

  /// Preferences to start with; tests pass their own to set the theme or text size.
  final AppPreferences? preferences;

  /// Provider overrides; tests give a memory session store or a mock NFC reader.
  final List<Override> overrides;

  @override
  State<IgongoApp> createState() => _IgongoAppState();
}

class _IgongoAppState extends State<IgongoApp> {
  // Created once, so the back stack survives theme and text size changes.
  late final _preferences = widget.preferences ?? AppPreferences();
  late final _router = buildAppRouter(initialLocation: widget.initialLocation);

  @override
  void dispose() {
    // Only dispose preferences this widget made itself.
    if (widget.preferences == null) _preferences.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => ProviderScope(
    overrides: widget.overrides,
    child: PreferencesScope(
      preferences: _preferences,
      child: ListenableBuilder(
        listenable: _preferences,
        builder: (context, _) => MaterialApp.router(
          title: 'Igongo',
          debugShowCheckedModeBanner: false,
          theme: IgongoTheme.light,
          darkTheme: IgongoTheme.dark,
          themeMode: _preferences.themeMode,
          routerConfig: _router,
          // The person's text size multiplies the phone's own setting, so both are respected.
          builder: (context, child) {
            final phone = MediaQuery.textScalerOf(context);
            final scaler = TextScaler.linear(phone.scale(1) * _preferences.textSize.scale);
            return MediaQuery(
              data: MediaQuery.of(context).copyWith(textScaler: scaler),
              child: child!,
            );
          },
        ),
      ),
    ),
  );
}
