// Opens every screen of the inventory in light and dark mode, and at the
// largest text size, and fails if any screen throws or overflows.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/shared/preferences/preferences.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  final screens = CatalogIndex.instance.screens.values.toList();

  // Each case: the theme and text size every screen is opened with.
  final cases = [
    ('light', ThemeMode.light, TextSize.standard),
    ('dark', ThemeMode.dark, TextSize.standard),
    ('dark, extra large text', ThemeMode.dark, TextSize.extraLarge),
  ];

  for (final (name, mode, size) in cases) {
    testWidgets('every screen opens in $name', (tester) async {
      // A phone-sized window, so overflows show up as they would on a phone.
      tester.view.physicalSize = const Size(390 * 3, 844 * 3);
      tester.view.devicePixelRatio = 3;
      addTearDown(tester.view.reset);
      for (final screen in screens) {
        // Step 1: open the screen with the case's theme and text size.
        final prefs = AppPreferences()
          ..themeMode = mode
          ..textSize = size;
        await tester.pumpWidget(
          IgongoApp(key: UniqueKey(), initialLocation: CatalogIndex.instance.locationOf(screen), preferences: prefs),
        );
        await tester.pump(const Duration(milliseconds: 50));
        // Step 2: any build error or overflow fails the test, naming the screen.
        final error = tester.takeException();
        expect(error, isNull, reason: '${screen.id} ${screen.name} ($name)');
      }
    });
  }
}
