// Golden (screenshot) tests for the Filter & Refine screen, in light and dark
// mode. The window is tall enough to show every section and the pinned bar at
// once. Regenerate with --update-goldens on Linux, like the other goldens.

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/refine/presentation/filter_refine_screen.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:material_ui/material_ui.dart';

import '../support/load_fonts.dart';
import '../support/open_app.dart';

void main() {
  setUpAll(loadAppFonts);

  // Step 1: the two modes the screen is drawn in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    testWidgets('Filter & Refine screen, $modeName', (tester) async {
      // Step 2: a 390 by 1640 window, two device pixels each, so every section and the bar show.
      usePhoneWindow(tester, width: 390, height: 1640, ratio: 2);
      // Step 3: the screen under the app theme, in this mode.
      await tester.pumpWidget(
        MaterialApp(
          theme: IgongoTheme.light,
          darkTheme: IgongoTheme.dark,
          themeMode: mode,
          home: const FilterRefineScreen(),
        ),
      );
      await tester.pump(const Duration(milliseconds: 50));
      // Step 4: compare with the approved picture.
      await expectLater(find.byType(FilterRefineScreen), matchesGoldenFile('goldens/$modeName/filter_refine.png'));
    });
  }
}
