// Which screens show the app's frame (app bar, menu and bottom bar). The
// start-up and sign-in screens, and shared kiosk screens, show without it.

import '../../shared/catalog/catalog.dart';

/// Rules for the frame around a screen.
abstract final class ChromeRules {
  // Screens drawn edge to edge with no frame at all: splash, welcome, sign in and create account.
  static const _fullScreen = {'S00-01', 'S00-02', 'S00-05', 'S00-18'};

  /// Whether [spec] is drawn edge to edge, with no app bar.
  static bool fullScreen(ScreenSpec spec) => _fullScreen.contains(spec.id);

  /// Whether [spec] shows the bottom bar and the menu: only once signed in,
  /// and never on a shared kiosk.
  static bool signedIn(ScreenSpec spec) {
    // The sign-in screens are module 00, numbers 1 to 20.
    final beforeSignIn = spec.module == '00' && int.parse(spec.id.substring(4)) <= 20;
    final kioskOnly = spec.surfaces.length == 1 && spec.surfaces.first == Surface.kiosk;
    return !beforeSignIn && !kioskOnly;
  }
}
