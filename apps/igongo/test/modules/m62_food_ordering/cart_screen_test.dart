// The guest cart: an empty cart says so and offers the food shop; the demo
// menu lists its out-of-stock dish last and can be switched off in one place.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m62_food_ordering/demo/demo_orders.dart';
import 'package:igongo/modules/m62_food_ordering/domain/cart_line.dart';
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

  test('a demo order is kept on the phone with a DEMO number and the right total', () {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    final order = container.read(demoOrdersProvider.notifier).place(const [
      CartLine(itemId: 'demo-rolex', name: 'Rolex', quantity: 2, options: [], unitPrice: 5000),
    ], 'takeaway');
    expect(order.number, 'DEMO-0001');
    expect(order.total, 10000);
    expect(container.read(demoOrdersProvider), [order]);
  });
}
