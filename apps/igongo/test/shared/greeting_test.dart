// The guest greeting follows the hotel's time of day (UTC+3).

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/format/greeting.dart';

void main() {
  test('morning, afternoon and evening in hotel time, with the first name only', () {
    expect(greetingFor(DateTime.utc(2026, 11, 26, 4), 'Victor Bee'), 'Good morning, Victor');
    expect(greetingFor(DateTime.utc(2026, 11, 26, 10), 'Victor'), 'Good afternoon, Victor');
    expect(greetingFor(DateTime.utc(2026, 11, 26, 16), null), 'Good evening');
  });
}
