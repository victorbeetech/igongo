// Native Sign in with Apple for the iPhone app. Apple's sheet returns an ID
// token (audience = the app's bundle ID) that the API verifies. Android and the
// web do not use this file's flow.

import 'package:sign_in_with_apple/sign_in_with_apple.dart';

import '../api/api_exception.dart';
import 'social_id_token.dart';

/// Runs Sign in with Apple on this iPhone.
class AppleNativeSignIn {
  /// Opens Apple's sheet. Returns the token, or null when the person cancels.
  /// Throws [ApiException] when Apple could not finish.
  Future<SocialIdToken?> signIn() async {
    try {
      // Step 1: ask for the email and name (Apple gives them on the first sign-in only).
      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [AppleIDAuthorizationScopes.email, AppleIDAuthorizationScopes.fullName],
      );
      // Step 2: the ID token is what the API checks with Apple.
      final token = credential.identityToken;
      if (token == null || token.isEmpty) {
        throw const ApiException(0, 'apple_no_token', 'Apple did not send a sign-in token. Try again.');
      }
      // Step 3: keep the name and email Apple sent, if any, for the first sign-in.
      return SocialIdToken(
        provider: 'apple',
        token: token,
        firstName: credential.givenName,
        lastName: credential.familyName,
        email: credential.email,
      );
    } on SignInWithAppleAuthorizationException catch (e) {
      // Step 4: a cancelled sheet is not an error to show.
      if (e.code == AuthorizationErrorCode.canceled) return null;
      throw const ApiException(0, 'apple_failed', 'Sign in with Apple did not finish. Try again, or use email and password.');
    }
  }
}
