// The sign-up form check, as one pure function so it can be tested without a
// screen. The sign-up screen sends nothing unless this returns null. The server
// checks the same rules again, so this only saves a round trip.

import 'passwords_match.dart';

/// The first thing wrong with a sign-up form, or null when it can be sent.
///
/// [name], [email], [password] and [again] are the text in the four boxes.
/// [agreed] is whether the privacy box is ticked. The order is the order the
/// person fills the form in, so the first message is the first problem to fix.
String? signUpProblem({
  required String name,
  required String email,
  required String password,
  required String again,
  required bool agreed,
}) {
  // Step 1: the name must have some text in it.
  if (name.trim().isEmpty) return 'Enter your name.';
  // Step 2: a quick check that the email has an @ sign.
  if (!email.contains('@')) return 'Enter your email.';
  // Step 3: the password must be long enough.
  if (password.length < 8) return 'Use a password of at least 8 characters.';
  // Step 4: the confirm box must hold exactly the same text. This blocks sending.
  if (!passwordsMatch(password, again)) return passwordsDifferMessage;
  // Step 5: the privacy notice must be agreed to.
  if (!agreed) return 'Please agree to the privacy notice.';
  return null;
}
