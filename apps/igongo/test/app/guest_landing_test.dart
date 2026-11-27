// A signed-in guest on the phone lands on the guest home. The staff menu (the
// role drawer) must not exist for a guest, and the super admin's Preview
// button must not show. The session is faked, so no API is called.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/shell/role_drawer.dart';
import 'package:igongo/shared/session/session.dart';
import 'package:igongo/shared/session/session_controller.dart';

import '../support/open_app.dart';

/// A signed-in guest: a client account with only the guest role.
class _GuestSessionController extends SessionController {
  @override
  Future<Session?> build() async => const Session(
    token: 'test-token',
    userId: 'acc_guest_test',
    name: 'Grace Guest',
    email: 'guest@example.com',
    isStaff: false,
    permissions: [],
    roleKeys: ['guest'],
  );
}

void main() {
  testWidgets('a signed-in guest lands on the guest home with no staff menu', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_GuestSessionController.new)],
    );
    // Step 1: the guest home greets the guest by first name (the greeting depends on the hour).
    expect(find.textContaining('Grace'), findsOneWidget);
    // Step 2: no staff menu: the frame has no drawer for a guest.
    expect(find.byType(RoleDrawer), findsNothing);
    // Step 2b: the guest home shows the "Explore Igongo" areas, including Order.
    expect(find.text('Order'), findsOneWidget);
    // Step 3: no super admin Preview button for a guest.
    expect(find.byTooltip('Preview'), findsNothing);
  });
}
