// Who is signed in, for the whole app (Riverpod). On start it restores the
// saved token and checks it with the API; sign-in saves a new one; sign-out
// forgets it. Every live screen watches [sessionProvider].

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../api/api_config.dart';
import '../api/api_exception.dart';
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
  Future<void> deleteMyAccount() async {
    await ref.read(apiClientProvider).post('/api/auth/delete-user', const <String, dynamic>{});
    await ref.read(sessionStoreProvider).clear();
    state = const AsyncData(null);
  }

  /// Signs out here and on the server.
  Future<void> signOut() async {
    try {
      await ref.read(apiClientProvider).post('/api/auth/sign-out', const <String, dynamic>{});
    } on ApiException {
      // Signed out locally even when the server cannot be reached.
    }
    await ref.read(sessionStoreProvider).clear();
    state = const AsyncData(null);
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
