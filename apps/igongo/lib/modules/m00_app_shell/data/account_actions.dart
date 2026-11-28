// The two guest account switches the super admin sets on the web: whether
// guests may sign out in the app, and whether they may delete their own
// account. Read from the public login-methods endpoint, so no sign-in is needed.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';

/// The two switches. Both are on until the server says otherwise.
class AccountActions {
  /// Creates the switches.
  const AccountActions({required this.allowSignOut, required this.allowSelfDelete});

  /// Both on: the default while the server's answer is loading or unreachable.
  static const defaults = AccountActions(allowSignOut: true, allowSelfDelete: true);

  /// Whether the Sign Out row is shown in the profile.
  final bool allowSignOut;

  /// Whether a guest sees the Delete Account row in the profile.
  final bool allowSelfDelete;

  /// Reads the switches from the login-methods reply. A missing key counts as on.
  factory AccountActions.fromJson(Map<String, dynamic> json) => AccountActions(
    allowSignOut: json['allowSignOut'] != false,
    allowSelfDelete: json['allowSelfDelete'] != false,
  );
}

/// The switches from the server, loaded once per app run. A failed call keeps the defaults.
final accountActionsProvider = FutureProvider<AccountActions>((ref) async {
  // Step 1: the public login-methods endpoint carries the switches.
  final json = await ref.read(apiClientProvider).get('/api/login-methods');
  // Step 2: read the two switches from the reply.
  return AccountActions.fromJson(json);
});
