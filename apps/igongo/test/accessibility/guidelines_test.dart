// Accessibility check of every screen with Flutter's own guideline tools:
// tap targets of at least 48 by 48 (Android) and 44 by 44 (iPhone), and every
// tappable item has a label for screen readers. Runs in light and dark mode.
//
// Colour contrast is checked from the tokens by tools/contrast-check (every
// pair the components draw) and on the web pages by tools/a11y-check (axe).
// Flutter's own textContrastGuideline is not used: it samples screenshot
// pixels, and on small anti-aliased text it reports false failures.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/shared/catalog/catalog.dart';
import 'package:material_ui/material_ui.dart';

import '../support/open_app.dart';

void main() {
  // Every screen the app shows (web-only screens show a short notice instead).
  final screens = CatalogIndex.instance.screens.values.where((s) => s.surfaces.contains(Surface.app)).toList();

  for (final (name, mode) in [('light', ThemeMode.light), ('dark', ThemeMode.dark)]) {
    testWidgets('every screen meets the accessibility guidelines in $name mode', (tester) async {
      final handle = tester.ensureSemantics();
      usePhoneWindow(tester);
      final failures = <String>[];
      for (final screen in screens) {
        // Step 1: open the screen.
        await openApp(tester, CatalogIndex.instance.locationOf(screen), mode: mode);
        // Step 2: run each guideline and keep the screen's name with any failure.
        for (final guideline in [androidTapTargetGuideline, iOSTapTargetGuideline, labeledTapTargetGuideline]) {
          final result = await guideline.evaluate(tester);
          if (!result.passed) failures.add('${screen.id} ${screen.name}: ${result.reason}');
        }
      }
      handle.dispose();
      // Step 3: one report of every failure, so they can all be fixed at once.
      expect(failures, isEmpty, reason: failures.join('\n\n'));
    });
  }
}
