// The Bookings home tiles: nine tiles, each opening its own screen.

import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking_categories.dart';
import 'package:igongo/shared/bookings/presentation/booking_category_card.dart';

import '../../../support/pump_component.dart';

void main() {
  test('the home has the nine tiles in order', () {
    expect(bookingCategories.map((c) => c.label), [
      'Rooms',
      'Food',
      'Tables',
      'Events',
      'Spa',
      'Museum and Tours',
      'Pool Passes',
      'Shop',
      'Chat',
    ]);
    expect(bookingCategories.map((c) => c.screenId), [
      'S67-02',
      'S62-01',
      'S64-04',
      'S69-01',
      'S72-01',
      'S68-01',
      'S71-01',
      'S73-01',
      'S74-03',
    ]);
  });

  bothModes('a category card shows its label and reports a tap', (tester, dark) async {
    var taps = 0;
    await pumpComponent(
      tester,
      // The tile fills the space it is given, so it gets a square one.
      SizedBox(width: 110, height: 110, child: BookingCategoryCard(category: bookingCategories.first, onTap: () => taps++)),
      dark: dark,
    );
    expect(find.text('Rooms'), findsOneWidget);
    await tester.tap(find.text('Rooms'));
    expect(taps, 1);
  });
}
