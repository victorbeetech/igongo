// Golden (screenshot) tests for the Contact Us screen (S00-46), on a large phone
// in light and dark mode. The picture is compared with the approved image so any
// visual change shows up. Regenerate on Linux, like the other goldens.

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:material_ui/material_ui.dart';

import '../support/open_app.dart';

void main() {
  // Step 1: the two modes the Contact Us screen is checked in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    testWidgets('Contact Us screen on a large phone, $modeName', (tester) async {
      // Step 2: a phone-sized window, two device pixels each.
      usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
      // Step 3: open the screen as a signed-out person (it is public).
      await openApp(
        tester,
        CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-46']!),
        mode: mode,
        preview: false,
      );
      // Step 4: compare with the approved picture.
      await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/$modeName/contact_us_large.png'));
    });
  }

  // Step 5: the sign-in screen, to show the "Contact Us" link in its footer (light mode).
  testWidgets('Sign in screen shows the Contact Us link, light', (tester) async {
    usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
    await openApp(
      tester,
      CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-05']!),
      mode: ThemeMode.light,
      preview: false,
    );
    await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/light/sign_in_contact_link.png'));
  });
}
