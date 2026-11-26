// The guest cart: an empty cart says so and offers the food shop; the demo
// menu lists its out-of-stock dish last and can be switched off in one place.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m62_food_ordering/demo/demo_menu.dart';

import '../../support/open_app.dart';

void main() {
  testWidgets('an empty cart shows the empty state and a way to the food shop', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/food-ordering/cart', preview: false);
    expect(find.text('Your cart is empty'), findsOneWidget);
    expect(find.text('Browse food'), findsOneWidget);
  });

  test('the demo menu has an available dish and an unavailable one, and only the demo outlet counts', () {
    expect(demoMenuItems.any((i) => i.available), isTrue);
    expect(demoMenuItems.any((i) => !i.available), isTrue);
    expect(isDemoOutlet(demoOutletKey), demoMenuOn);
    expect(isDemoOutlet('restaurant'), isFalse);
  });
}
