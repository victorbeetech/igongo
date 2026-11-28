// A signed-in guest on the phone lands on the guest home. The staff menu (the
// role drawer) must not exist for a guest, and the super admin's Preview
// button must not show. The session is faked, so no API is called.

import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/app/shell/role_drawer.dart';
import 'package:igongo/shared/session/session_controller.dart';

import '../support/guest_session.dart';
import '../support/open_app.dart';

void main() {
  testWidgets('a signed-in guest lands on the guest home with no staff menu', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/home',
      preview: false,
      overrides: [sessionProvider.overrideWith(FakeGuestSession.new)],
    );
    // Step 1: the guest home greets the guest by first name.
    expect(find.textContaining(', Grace'), findsOneWidget);
    // Step 1b: no "Home" title bar: the greeting header sits at the top instead.
    expect(find.byType(AppBar), findsNothing);
    // Step 2: no staff menu: the frame has no drawer for a guest.
    expect(find.byType(RoleDrawer), findsNothing);
    // Step 2b: the meals slideshow replaces the old "Today's menu" words.
    expect(find.text("Today's menu"), findsNothing);
    // The two-row quick actions push the dish row below the fold, so scroll down to it first.
    await tester.scrollUntilVisible(
      find.bySemanticsLabel('Meals to order'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    expect(find.bySemanticsLabel('Meals to order'), findsOneWidget);
    // Step 3: no super admin Preview button for a guest.
    expect(find.byTooltip('Preview'), findsNothing);
  });
}
