// Golden (screenshot) tests: the key screens, the screen states and the
// design system showcase, in light and dark mode, compared pixel by pixel
// with the approved images in test/golden/goldens/. A change to the theme or
// a shared component that changes how a screen looks fails here until the new
// images are reviewed and saved with:
//
//     flutter test --update-goldens test/golden
//
// The images are made on Linux (as in CI); fonts render slightly differently
// on other systems, so update them on Linux only.

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/shared/states/view_state.dart';
import 'package:material_ui/material_ui.dart';

import '../support/key_screens.dart';
import '../support/open_app.dart';

void main() {
  // The two modes every image is made in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    group(modeName, () {
      // Step 1: one screen per layout kind (home, list, form, scanner and so on).
      for (final screen in keyScreens()) {
        testWidgets('${screen.kind.name}: ${screen.name}', (tester) async {
          usePhoneWindow(tester, ratio: 2);
          await openApp(tester, CatalogIndex.instance.locationOf(screen), mode: mode);
          await expectLater(
            find.byType(IgongoApp),
            matchesGoldenFile('goldens/$modeName/kind_${screen.kind.name}.png'),
          );
        });
      }

      // Step 2: the screen states, on the first list screen.
      final list = keyScreens().firstWhere((s) => s.kind.name == 'list');
      for (final state in [
        ViewState.loading,
        ViewState.empty,
        ViewState.error,
        ViewState.denied,
        ViewState.success,
        ViewState.offline,
      ]) {
        testWidgets('state: ${state.name}', (tester) async {
          usePhoneWindow(tester, ratio: 2);
          await openApp(tester, CatalogIndex.instance.locationOf(list), mode: mode, state: state);
          await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/$modeName/state_${state.name}.png'));
        });
      }

      // Step 3: the design system showcase, in a tall window so every section shows.
      testWidgets('design system showcase', (tester) async {
        usePhoneWindow(tester, height: 3500, ratio: 1.5);
        await openApp(tester, '/design-system', mode: mode);
        await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/$modeName/design_system.png'));
      });
    });
  }
}
