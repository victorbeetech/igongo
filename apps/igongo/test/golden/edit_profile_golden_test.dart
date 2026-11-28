// Golden (screenshot) tests for Edit Profile (S54-06): a large and a small
// phone, in light and dark mode. Regenerate with the app workflow's regenerate
// option (made on Linux, like the other goldens).

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/modules/m54_crm_guests/application/crm_providers.dart';
import 'package:igongo/modules/m54_crm_guests/domain/guest_profile.dart';
import 'package:igongo/shared/session/session_controller.dart';
import 'package:material_ui/material_ui.dart';

import '../support/guest_session.dart';
import '../support/open_app.dart';

void main() {
  // Step 1: the two modes and the two phone sizes every Edit Profile image is made in.
  const modes = {'light': ThemeMode.light, 'dark': ThemeMode.dark};
  const phones = {'large': Size(430, 932), 'small': Size(360, 640)};

  // Step 2: a sample guest, used for the picture only (the app reads the real API).
  const profile = GuestProfile(
    name: 'Grace Muhwezi',
    sms: true,
    whatsapp: true,
    email: false,
    contactEmail: 'grace@example.com',
    phone: '+256 772 123 456',
    preferences: 'Garden cottage, extra pillows, fresh passion juice.',
    allergies: 'Mild gluten sensitivity.',
  );

  for (final MapEntry(key: modeName, value: mode) in modes.entries) {
    for (final MapEntry(key: phoneName, value: size) in phones.entries) {
      testWidgets('Edit Profile on a $phoneName phone, $modeName', (tester) async {
        // Step 3: a window the size of the phone, two device pixels each.
        usePhoneWindow(tester, width: size.width, height: size.height, ratio: 2);
        // Step 4: the signed-in guest on Edit Profile.
        await openApp(
          tester,
          CatalogIndex.instance.locationOf(CatalogIndex.instance.screens['S54-06']!),
          mode: mode,
          preview: false,
          overrides: [
            sessionProvider.overrideWith(FakeGuestSession.new),
            myProfileProvider.overrideWith((ref) async => profile),
          ],
        );
        // Step 5: compare with the approved picture.
        await expectLater(
          find.byType(IgongoApp),
          matchesGoldenFile('goldens/$modeName/edit_profile_$phoneName.png'),
        );
      });
    }
  }
}
