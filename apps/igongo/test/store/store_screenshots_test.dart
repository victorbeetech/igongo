// App Store and Play Store screenshots, made from the real screens with
// sample data, in the sizes each store asks for. They are saved into the
// brand kit (packages/brand/store/screenshots) and compared like golden
// images, so a change to a screen shows up here too. Make new ones with:
//
//     flutter test --update-goldens test/store
//
// Phone sizes: Play Store 1080 x 1920; App Store 6.9 inch, 1320 x 2868.

@Tags(['golden'])
library;

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:igongo/modules/m10_notifications/application/inbox_providers.dart';
import 'package:igongo/modules/m10_notifications/domain/inbox_page.dart';
import 'package:material_ui/material_ui.dart';

import '../support/open_app.dart';
import '../support/public_settings_fixture.dart';

// The screens the listings show, in order: what a guest and a staff member see first.
// Each shot: its address and the role it is taken as.
const _shots = {
  '01-guest-home': ('/home', 'guest'),
  '02-food-menu': ('/food-ordering/outlet-menu', 'guest'),
  '03-my-card': ('/staff-cards/my-card', 'receptionist'),
  '04-clock-in': ('/attendance/clock-in', 'receptionist'),
  '05-attendance-today': ('/attendance/attendance-today', 'super-admin'),
};

// Each store: its folder and the phone size in logical pixels at 3x.
const _stores = {'play-store': (360.0, 640.0), 'app-store': (440.0, 956.0)};

void main() {
  for (final MapEntry(key: store, value: (width, height)) in _stores.entries) {
    for (final MapEntry(key: name, value: (path, role)) in _shots.entries) {
      testWidgets('$store $name', (tester) async {
        usePhoneWindow(tester, width: width, height: height);
        // A fixed empty inbox, so the guest home's bell has no dot and no network call is made.
        await openApp(
          tester,
          path,
          mode: ThemeMode.light,
          role: role,
          settings: emptyPublicSettings,
          overrides: [inboxProvider.overrideWith((ref) async => const InboxPage(items: [], unreadCount: 0))],
        );
        await expectLater(
          find.byType(IgongoApp),
          matchesGoldenFile('../../../../packages/brand/store/screenshots/$store/$name.png'),
        );
      });
    }
  }
}
