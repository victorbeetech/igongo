// The guest profile read from the API: the contact email is kept apart from
// the marketing consent flags, which the app shows as its switches.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m54_crm_guests/domain/guest_profile.dart';

void main() {
  test('reads the contact email and the consent flags separately', () {
    final profile = GuestProfile.fromJson({
      'name': 'Grace Muhwezi',
      'email': 'grace@example.com',
      'phone': '+256 700 000000',
      'consent': {'sms': true, 'whatsapp': false, 'email': true},
    });
    expect(profile.contactEmail, 'grace@example.com');
    expect(profile.email, isTrue);
    expect(profile.sms, isTrue);
    expect(profile.whatsapp, isFalse);
  });

  test('a new profile with no consent map reads as nothing agreed', () {
    final profile = GuestProfile.fromJson({'name': 'New Guest', 'email': null});
    expect(profile.contactEmail, isNull);
    expect(profile.sms || profile.whatsapp || profile.email, isFalse);
  });
}
