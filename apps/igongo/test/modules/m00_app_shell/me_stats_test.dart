// Reads the profile numbers from the API's JSON: a missing or null number is
// 0, so the profile shows a dash rather than a made-up figure.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/domain/me_stats.dart';

void main() {
  test('reads all four numbers', () {
    final s = MeStats.fromJson({'bookings': 2, 'orders': 5, 'points': 40, 'savedDishes': 3});
    expect(s.bookings, 2);
    expect(s.orders, 5);
    expect(s.points, 40);
    expect(s.savedDishes, 3);
  });

  test('a missing or null number counts as 0', () {
    final s = MeStats.fromJson({'orders': null});
    expect(s.bookings, 0);
    expect(s.orders, 0);
    expect(s.points, 0);
    expect(s.savedDishes, 0);
  });
}
