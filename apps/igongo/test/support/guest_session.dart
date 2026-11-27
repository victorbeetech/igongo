// A faked signed-in guest, shared by the screen tests. Overriding the session
// with this class means no sign-in and no API call is made.

import 'package:igongo/shared/session/session.dart';
import 'package:igongo/shared/session/session_controller.dart';

/// A signed-in guest: a client account with only the guest role.
class FakeGuestSession extends SessionController {
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
