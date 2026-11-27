// Opens the app at one address with a chosen theme, text size and screen
// state, in a phone-sized window. Shared by every screen test.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo/shared/clock/app_clock.dart';
import 'package:igongo/shared/preferences/preferences.dart';
import 'package:igongo/shared/states/view_state.dart';
import 'package:material_ui/material_ui.dart';

/// The pinned time for every test: 09:00 in the hotel's time zone (UTC+3), so
/// the guest greeting always reads "Good morning" and the screenshots never change.
final _pinnedClock = clockProvider.overrideWithValue(() => DateTime.utc(2026, 11, 27, 6));

/// Sets a [width] by [height] window (logical pixels) at [ratio] device pixels each.
void usePhoneWindow(WidgetTester tester, {double width = 390, double height = 844, double ratio = 3}) {
  tester.view.physicalSize = Size(width * ratio, height * ratio);
  tester.view.devicePixelRatio = ratio;
  addTearDown(tester.view.reset);
}

/// Opens the app at [location] and lets it draw its first frames. [role] picks
/// the role whose home and menu show (the super admin when left out). [preview]
/// is the super admin's design preview; off, the app draws as for a real person.
/// [overrides] swap providers, such as the signed-in session.
Future<void> openApp(
  WidgetTester tester,
  String location, {
  ThemeMode mode = ThemeMode.light,
  TextSize size = TextSize.standard,
  ViewState state = ViewState.normal,
  String? role,
  bool preview = true,
  List<Override> overrides = const [],
}) async {
  // Step 1: the preferences for this run.
  final prefs = AppPreferences()
    ..previewMode = preview
    ..themeMode = mode
    ..textSize = size
    ..state = state;
  if (role != null) prefs.roleKey = role;
  // Step 2: a fresh app each time, so nothing carries over between screens.
  await tester.pumpWidget(
    IgongoApp(key: UniqueKey(), initialLocation: location, preferences: prefs, overrides: [_pinnedClock, ...overrides]),
  );
  // Step 3: a few frames for the theme; animations are not waited for (they loop).
  await tester.pump(const Duration(milliseconds: 50));
  // Step 4: load every picture on screen (logos, the staff card) for real, so a
  // screenshot never catches one half loaded.
  await tester.runAsync(() async {
    for (final element in find.byType(Image).evaluate()) {
      await precacheImage((element.widget as Image).image, element);
    }
  });
  await tester.pump(const Duration(milliseconds: 300));
}
