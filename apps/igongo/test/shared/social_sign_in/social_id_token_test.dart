// Tests the body the phone sends to the API for a native Google or Apple
// sign-in. The API needs the provider key and the token; Apple's name and
// email are added only when Apple sent them (first sign-in).

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/social_sign_in/social_id_token.dart';

void main() {
  test('a Google token sends only the provider and the token', () {
    const social = SocialIdToken(provider: 'google', token: 'g-token');
    expect(social.toRequestBody(), {
      'provider': 'google',
      'idToken': {'token': 'g-token'},
    });
  });

  test('an Apple first sign-in sends the name and email with the token', () {
    const social = SocialIdToken(
      provider: 'apple',
      token: 'a-token',
      firstName: 'Asha',
      lastName: 'Okello',
      email: 'asha@privaterelay.appleid.com',
    );
    expect(social.toRequestBody(), {
      'provider': 'apple',
      'idToken': {
        'token': 'a-token',
        'user': {
          'name': {'firstName': 'Asha', 'lastName': 'Okello'},
          'email': 'asha@privaterelay.appleid.com',
        },
      },
    });
  });

  test('an Apple repeat sign-in with no name or email sends only the token', () {
    const social = SocialIdToken(provider: 'apple', token: 'a-token', firstName: '', lastName: null, email: null);
    expect(social.toRequestBody(), {
      'provider': 'apple',
      'idToken': {'token': 'a-token'},
    });
  });
}
