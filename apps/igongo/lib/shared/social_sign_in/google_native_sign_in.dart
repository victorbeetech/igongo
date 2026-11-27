// Native Google sign-in for the iPhone and Android app. It opens Google's own
// account picker and returns the ID token the API verifies. The API accepts
// the web, iPhone and Android client IDs (see google_client_ids.dart).

import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../api/api_exception.dart';
import '../api/google_client_ids.dart';
import 'social_id_token.dart';

/// Runs Google's sign-in on this phone.
class GoogleNativeSignIn {
  /// The one setup call, shared by every sign-in; kept so it runs only once.
  static Future<void>? _setup;

  /// Opens the Google account picker. Returns the ID token, or null when the
  /// person cancels. Throws [ApiException] when Google could not finish.
  Future<SocialIdToken?> signIn() async {
    try {
      // Step 1: set the client IDs once. iPhone uses its own client ID; Android
      // passes the web client as the server client ID so the token's audience is the web one.
      _setup ??= GoogleSignIn.instance.initialize(
        clientId: defaultTargetPlatform == TargetPlatform.iOS ? googleIosClientId : null,
        serverClientId: defaultTargetPlatform == TargetPlatform.android ? googleWebClientId : null,
      );
      await _setup;
      // Step 2: the account picker. The person may cancel here.
      final account = await GoogleSignIn.instance.authenticate();
      // Step 3: the ID token is what the API checks with Google.
      final idToken = account.authentication.idToken;
      if (idToken == null || idToken.isEmpty) {
        throw const ApiException(0, 'google_no_token', 'Google did not send a sign-in token. Try again.');
      }
      return SocialIdToken(provider: 'google', token: idToken, email: account.email);
    } on GoogleSignInException catch (e) {
      // Step 4: a cancelled or interrupted picker is not an error to show.
      if (e.code == GoogleSignInExceptionCode.canceled || e.code == GoogleSignInExceptionCode.interrupted) return null;
      throw const ApiException(0, 'google_failed', 'Google sign-in did not finish. Try again, or use email and password.');
    }
  }
}
