// Golden (screenshot) tests for the guest's Updates screen (S00-28), on a large
// phone in light and dark mode. The picture is compared with the approved image
// so any visual change shows up. Regenerate on Linux, like the other goldens.

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/modules/m10_notifications/application/inbox_providers.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_page.dart';
import 'package:igongo/shared/session/session_controller.dart';
import 'package:material_ui/material_ui.dart';

import '../support/guest_session.dart';
import '../support/open_app.dart';

void main() {
  // Step 1: the two modes the Updates screen is checked in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    testWidgets('Updates screen on a large phone, $modeName', (tester) async {
      // Step 2: a phone-sized window, two device pixels each.
      usePhoneWindow(tester, width: 430, height: 932, ratio: 2);
      // Step 3: the signed-in guest on the Updates screen.
      await openApp(
        tester,
        CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S00-28']!),
        mode: mode,
        preview: false,
        // A fixed empty inbox, so the picture never depends on the network.
        overrides: [
          sessionProvider.overrideWith(FakeGuestSession.new),
          inboxProvider.overrideWith((ref) async => const InboxPage(items: [], unreadCount: 0)),
        ],
      );
      // Step 4: compare with the approved picture.
      await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/$modeName/updates_large.png'));
    });
  }
}
