// Who is signed in, for the whole app (Riverpod). On start it restores the
// saved token and checks it with the API; sign-in saves a new one; sign-out
// forgets it. Every live screen watches [sessionProvider].

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../api/api_config.dart';
import '../api/api_exception.dart';
import '../../modules/m10_notifications/push_module.dart';
import '../social_sign_in/social_id_token.dart';
import 'session.dart';
import 'first_run_store.dart';
import 'session_store.dart';

/// Where the token is kept. Tests override it with a [MemorySessionStore].
final sessionStoreProvider = Provider<SessionStore>((ref) => SecureSessionStore());

/// Where "the welcome was seen" is kept. Tests override it.
final firstRunStoreProvider = Provider<FirstRunStore>((ref) => SecureFirstRunStore());

/// The API client, sending the current session's token.
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(baseUrl: igongoApiUrl, token: () => ref.read(sessionProvider).valueOrNull?.token);
});

/// The signed-in person, or null.
final sessionProvider = AsyncNotifierProvider<SessionController, Session?>(SessionController.new);

/// Restores, starts and ends the session.
class SessionController extends AsyncNotifier<Session?> {
  @override
  Future<Session?> build() async {
    // Step 1: a saved token from an earlier start?
    final token = await ref.read(sessionStoreProvider).read();
    if (token == null) return null;
    // Step 2: check it is still valid; a dead token is forgotten.
    try {
      return await _load(token);
    } on ApiException catch (e) {
      if (e.needsSignIn) await ref.read(sessionStoreProvider).clear();
      return null;
    }
  }

  /// Signs in with email and password. @throws ApiException with the API's message
  Future<void> signInWithEmail(String email, String password) async {
    // Better Auth's bearer plugin sends the session token in `set-auth-token`.
    final reply = await ref.read(apiClientProvider).post('/api/auth/sign-in/email', {
      'email': email.trim().toLowerCase(),
      'password': password,
    });
    await _start(reply);
  }

  /// Signs in with a Google or Apple ID token from the phone's native sign-in.
  /// The API checks the token with the provider and refuses the super admin.
  /// @throws ApiException with the API's message (unknown account, refused...)
  Future<void> signInWithSocial(SocialIdToken social) async {
    // Step 1: send the provider's token to Better Auth's native ID-token sign-in.
    final reply = await ref.read(apiClientProvider).post('/api/auth/sign-in/social', social.toRequestBody());
    // Step 2: the same session start as email sign-in (token saved, person loaded).
    await _start(reply);
  }

  /// Keeps the session token from a sign-in or sign-up reply.
  Future<void> _start(Map<String, dynamic> reply) async {
    // Accounts with 2-step on finish signing in on the web portal for now (the app's 2-step screen is not built yet).
    if (reply['twoFactorRedirect'] == true) {
      throw const ApiException(
        403,
        'two_factor_required',
        'This account uses 2-step sign-in. Please sign in on the web portal.',
      );
    }
    final headers = reply['_headers'] as Map<String, String>? ?? const {};
    final token = headers['set-auth-token'] ?? '${reply['token'] ?? ''}';
    if (token.isEmpty) throw const ApiException(500, 'no_token', 'Sign-in worked but no session came back. Try again.');
    final session = await _load(token);
    await ref.read(sessionStoreProvider).write(token);
    state = AsyncData(session);
  }

  /// Creates a guest account in the app (the web portal is for staff only),
  /// then signs in with it. The server makes every new account a guest
  /// account; nobody can pick a role here.
  /// @throws ApiException with the API's message (weak password, email taken...)
  Future<void> signUpWithEmail(String name, String email, String password) async {
    final reply = await ref.read(apiClientProvider).post('/api/auth/sign-up/email', {
      'name': name.trim(),
      'email': email.trim().toLowerCase(),
      'password': password,
    });
    await _start(reply);
  }

  /// Deletes the person's own account on the server, then forgets it here.
  /// Staff accounts are refused by the server (HR closes them).
  /// The account's own signed-in session is the only one the server deletes,
  /// so a person can never delete someone else's account from the app.
  Future<void> deleteMyAccount() async {
    // Step 1: switch push off first, while the token still works.
    await _stopPush();
    // Step 2: the server deletes the account; a refusal throws ApiException and keeps the session.
    await ref.read(apiClientProvider).post('/api/auth/delete-user', const <String, dynamic>{});
    // Step 3: forget the token on this phone.
    await ref.read(sessionStoreProvider).clear();
    state = const AsyncData(null);
  }

  /// Signs out here and on the server. Push is switched off for this phone first,
  /// so the next person who signs in never gets this person's notifications.
  Future<void> signOut() async {
    // Step 1: switch push off while the token still works.
    await _stopPush();
    // Step 2: end the session on the server. A failed call still signs out here.
    try {
      await ref.read(apiClientProvider).post('/api/auth/sign-out', const <String, dynamic>{});
    } on ApiException {
      // Signed out locally even when the server cannot be reached.
    }
    // Step 3: forget the token on this phone and clear the session.
    await ref.read(sessionStoreProvider).clear();
    state = const AsyncData(null);
  }

  /// Removes this phone's push token for the signed-in person, if there is one.
  /// Never throws, so it cannot block sign-out or deletion.
  Future<void> _stopPush() async {
    // Step 1: no session, nothing to stop.
    final token = state.valueOrNull?.token;
    if (token == null) return;
    // Step 2: hand the token to the push module, which removes it on the API and the phone.
    await PushModule.instance?.stopForSignOut(baseUrl: igongoApiUrl, token: token);
  }

  /// The person and their access, for [token].
  Future<Session> _load(String token) async {
    final api = ApiClient(baseUrl: igongoApiUrl, token: () => token);
    final me = await api.get('/api/users/me');
    final access = await api.get('/api/access/me');
    final account = (me['account'] as Map<String, dynamic>?) ?? me;
    return Session(
      token: token,
      userId: '${account['id'] ?? access['userId']}',
      name: '${account['name'] ?? ''}',
      email: '${account['email'] ?? ''}',
      displayId: '${account['displayId'] ?? ''}',
      isStaff: access['isStaff'] == true,
      permissions: [
        for (final p in access['permissions'] as List<dynamic>? ?? const []) '${(p as Map<String, dynamic>)['key']}',
      ],
      roleKeys: [
        for (final r in access['roles'] as List<dynamic>? ?? const []) '${(r as Map<String, dynamic>)['key']}',
      ],
    );
  }
}
