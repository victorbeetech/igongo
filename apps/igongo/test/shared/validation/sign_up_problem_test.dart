// The sign-up form check: each rule blocks sending with its message, and a
// complete, matching form passes. Pure logic, so no screen is needed.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/validation/passwords_match.dart';
import 'package:igongo/shared/validation/sign_up_problem.dart';

/// Builds a form that passes every rule, so each test changes one thing.
String? _check({
  String name = 'Grace Nakato',
  String email = 'grace@example.com',
  String password = 'Igongo2026',
  String again = 'Igongo2026',
  bool agreed = true,
}) => signUpProblem(name: name, email: email, password: password, again: again, agreed: agreed);

void main() {
  test('a complete form with matching passwords can be sent', () {
    expect(_check(), isNull);
  });

  test('an empty name blocks sending', () {
    expect(_check(name: '   '), 'Enter your name.');
  });

  test('an email without @ blocks sending', () {
    expect(_check(email: 'grace.example.com'), 'Enter your email.');
  });

  test('a short password blocks sending before the match is checked', () {
    expect(_check(password: 'Abc1', again: 'Abc1'), 'Use a password of at least 8 characters.');
  });

  test('different confirm text blocks sending, with the message', () {
    expect(_check(again: 'Igongo2027'), passwordsDifferMessage);
  });

  test('confirm text that differs only by case blocks sending', () {
    expect(_check(again: 'igongo2026'), passwordsDifferMessage);
  });

  test('an empty confirm box blocks sending when the password is set', () {
    expect(_check(again: ''), passwordsDifferMessage);
  });

  test('a matching password without the privacy tick blocks sending', () {
    expect(_check(agreed: false), 'Please agree to the privacy notice.');
  });
}
