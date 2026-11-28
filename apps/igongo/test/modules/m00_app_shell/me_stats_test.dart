// Reads the profile numbers from the API's JSON: a missing or null number is
// 0, so the profile shows a dash rather than a made-up figure.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/domain/me_stats.dart';

void main() {
  test('reads all three numbers', () {
    // Step 1: read a full set of numbers from the API's JSON.
    final s = MeStats.fromJson({'bookings': 2, 'orders': 5, 'points': 40});
    // Step 2: each number lands in its own field.
    expect(s.bookings, 2);
    expect(s.orders, 5);
    expect(s.points, 40);
  });

  test('a missing or null number counts as 0', () {
    // Step 1: only the orders are given; the others are missing.
    final s = MeStats.fromJson({'orders': null});
    // Step 2: every missing or null number reads as 0.
    expect(s.bookings, 0);
    expect(s.orders, 0);
    expect(s.points, 0);
  });
}
