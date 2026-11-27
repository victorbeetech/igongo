// The result of a native Google or Apple sign-in: the provider's ID token and,
// for Apple's first sign-in only, the person's name and email. The session
// controller sends it to the API, which checks the token with the provider.

/// A provider ID token ready to send to the API.
class SocialIdToken {
  /// Creates the token. [provider] is `google` or `apple`, the API's keys.
  const SocialIdToken({required this.provider, required this.token, this.firstName, this.lastName, this.email});

  /// The API's key for the provider: `google` or `apple`.
  final String provider;

  /// The signed ID token from the provider. The API verifies it.
  final String token;

  /// Apple sends the name only on the first sign-in; null otherwise.
  final String? firstName;

  /// Apple's family name, sent with [firstName] on the first sign-in only.
  final String? lastName;

  /// Apple's email (may be a private relay address). Null when not sent.
  final String? email;

  /// The body the API's `/api/auth/sign-in/social` expects for a native ID token.
  /// The optional `user` block is only added when the provider sent one.
  Map<String, dynamic> toRequestBody() {
    // Step 1: the token itself, which Better Auth verifies against the provider's keys.
    final idToken = <String, dynamic>{'token': token};
    // Step 2: Apple's name and email, only when present (Better Auth stores them on first sign-in).
    final hasName = (firstName ?? '').isNotEmpty || (lastName ?? '').isNotEmpty;
    if (hasName || (email ?? '').isNotEmpty) {
      idToken['user'] = <String, dynamic>{
        if (hasName) 'name': <String, dynamic>{'firstName': firstName, 'lastName': lastName},
        if ((email ?? '').isNotEmpty) 'email': email,
      };
    }
    // Step 3: the provider key plus the token.
    return <String, dynamic>{'provider': provider, 'idToken': idToken};
  }
}
