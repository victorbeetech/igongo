// The Bookings home tiles: four tiles, each opening its own booking screen.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/booking_categories.dart';
import 'package:igongo/shared/bookings/presentation/booking_category_card.dart';

import '../../../support/pump_component.dart';

void main() {
  test('the home has the four categories in order', () {
    expect(bookingCategories.map((c) => c.label), ['Book a Room', 'Book a Table', 'Book Events', 'Spa']);
    expect(bookingCategories.map((c) => c.screenId), ['S67-02', 'S64-04', 'S69-01', 'S72-01']);
  });

  bothModes('a category card shows its label and reports a tap', (tester, dark) async {
    var taps = 0;
    await pumpComponent(
      tester,
      BookingCategoryCard(category: bookingCategories.first, onTap: () => taps++),
      dark: dark,
    );
    expect(find.text('Book a Room'), findsOneWidget);
    await tester.tap(find.text('Book a Room'));
    expect(taps, 1);
  });
}
