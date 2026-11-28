// The guest's Me tab (S00-31): the red banner is the app bar, so there is no
// separate "My profile" app bar, the bottom bar still shows, and no staff menu.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/shell/role_drawer.dart';
import 'package:igongo/modules/m00_app_shell/presentation/my_profile/profile_banner.dart';
import 'package:igongo/modules/m62_food_ordering/application/orders_providers.dart';
import 'package:igongo/modules/m62_food_ordering/domain/order.dart';
import 'package:igongo/shared/session/session_controller.dart';
import 'package:material_ui/material_ui.dart';

import '../support/guest_session.dart';
import '../support/open_app.dart';

void main() {
  testWidgets('a signed-in guest sees the banner as the app bar on the Me tab', (tester) async {
    usePhoneWindow(tester);
    // Step 1: open the Me tab (S00-31) as a signed-in guest, with no order list call.
    final me = CatalogIndex.instance.screens['S00-31']!;
    await openApp(
      tester,
      CatalogIndex.instance.locationOf(me),
      preview: false,
      overrides: [
        sessionProvider.overrideWith(FakeGuestSession.new),
        myOrdersProvider.overrideWith((ref) async => const <Order>[]),
      ],
    );
    // Step 2: the banner shows its title, and there is no app bar of its own.
    expect(find.byType(ProfileBanner), findsOneWidget);
    expect(find.text('Guest Profile'), findsOneWidget);
    expect(find.byType(AppBar), findsNothing);
    // Step 3: the bottom bar stays, and the staff menu does not exist for a guest.
    expect(find.byType(NavigationBar), findsOneWidget);
    expect(find.byType(RoleDrawer), findsNothing);
  });
}
