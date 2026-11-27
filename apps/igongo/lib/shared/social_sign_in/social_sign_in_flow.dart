// The Google and Apple sign-in flow shared by Sign in and Create account.
// The native sheet gives an ID token on this phone, then the API checks it and
// starts the session. Both screens use this one function, so they behave the same.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'sign_in_option.dart';
import '../session/session_controller.dart';
import 'apple_native_sign_in.dart';
import 'google_native_sign_in.dart';
import 'social_id_token.dart';
import 'social_sign_in_support.dart';

/// The server's Google and Apple options that this phone can finish natively.
/// Anything else (or a provider this phone cannot run) is left out, so no button
/// shows that would fail on tap.
List<SignInOption> availableSocialOptions(List<SignInOption> options) =>
    options.where((o) => (o.method == 'google' || o.method == 'apple') && isNativeSocialAvailable(o.method)).toList();

/// Runs the native sheet for [option], then signs the person in with the token.
/// Returns false when the person cancelled the sheet, true when the session started.
/// Errors from the API are thrown for the screen to show as a toast.
Future<bool> signInWithSocialOption(WidgetRef ref, SignInOption option) async {
  // Step 1: the native sheet for this provider (null means the person cancelled).
  final SocialIdToken? social = option.method == 'apple'
      ? await AppleNativeSignIn().signIn()
      : await GoogleNativeSignIn().signIn();
  if (social == null) return false;
  // Step 2: the API checks the token and starts the session.
  await ref.read(sessionProvider.notifier).signInWithSocial(social);
  return true;
}
