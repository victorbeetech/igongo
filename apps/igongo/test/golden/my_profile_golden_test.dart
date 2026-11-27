// Golden (screenshot) tests for the guest's Me tab (S00-31): a large and a
// small phone, in light and dark mode. The banner sits under the status bar,
// so these images show the new look. Regenerate with the app workflow's
// regenerate option (made on Linux, like the other goldens).

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/modules/m62_food_ordering/application/orders_providers.dart';
import 'package:igongo/modules/m62_food_ordering/domain/order.dart';
import 'package:igongo/shared/session/session_controller.dart';
import 'package:material_ui/material_ui.dart';

import '../support/guest_session.dart';
import '../support/open_app.dart';

void main() {
  // Step 1: the two modes and the two phone sizes every Me tab image is made in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};
  const phones = {'large': Size(430, 932), 'small': Size(360, 640)};

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    for (final MapEntry(key: phoneName, value: size) in phones.entries) {
      testWidgets('Me tab on a $phoneName phone, $modeName', (tester) async {
        // Step 2: a window the size of the phone, two device pixels each.
        usePhoneWindow(tester, width: size.width, height: size.height, ratio: 2);
        // Step 3: the signed-in guest on the Me tab, with no order list call.
        await openApp(
          tester,
          CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-31']!),
          mode: mode,
          preview: false,
          overrides: [
            sessionProvider.overrideWith(FakeGuestSession.new),
            myOrdersProvider.overrideWith((ref) async => const <Order>[]),
          ],
        );
        // Step 4: compare with the approved picture.
        await expectLater(
          find.byType(IgongoApp),
          matchesGoldenFile('goldens/$modeName/me_tab_$phoneName.png'),
        );
      });
    }
  }
}
