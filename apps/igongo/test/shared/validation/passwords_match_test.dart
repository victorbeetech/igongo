// The password match check: identical text passes, anything else fails.
// The sign-up screen blocks sending until this returns true.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/validation/passwords_match.dart';

void main() {
  test('two identical passwords match', () {
    expect(passwordsMatch('Igongo2026', 'Igongo2026'), isTrue);
  });

  test('a different second password does not match', () {
    expect(passwordsMatch('Igongo2026', 'Igongo2027'), isFalse);
  });

  test('the check is exact: case and spaces count', () {
    expect(passwordsMatch('Igongo2026', 'igongo2026'), isFalse);
    expect(passwordsMatch('Igongo2026', 'Igongo2026 '), isFalse);
  });

  test('two empty boxes match, so the length rule catches them instead', () {
    expect(passwordsMatch('', ''), isTrue);
  });

  test('the message tells the person the two passwords differ', () {
    expect(passwordsDifferMessage, 'The two passwords are not the same.');
  });
}
