// End to end as a signed-in guest on the demo menu: open the food shop, add a
// demo dish, open the cart, check out and place the order. The session and
// the food API are faked, so nothing is sent anywhere.

import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/application/orders_providers.dart';
import 'package:igongo/modules/m62_food_ordering/data/orders_api.dart';
import 'package:igongo/modules/m62_food_ordering/domain/delivery_zone.dart';
import 'package:igongo/modules/m62_food_ordering/domain/item_stars.dart';
import 'package:igongo/modules/m62_food_ordering/domain/order.dart';
import 'package:igongo/modules/m62_food_ordering/domain/outlet.dart';
import 'package:igongo/shared/api/api_client.dart';
import 'package:igongo/shared/session/session.dart';
import 'package:igongo/shared/session/session_controller.dart';

import '../../support/open_app.dart';

/// A guest with no staff roles.
class _Guest extends SessionController {
  @override
  Future<Session?> build() async => const Session(
    token: 't',
    userId: 'acc_guest_test',
    name: 'Victor Bee',
    isStaff: false,
    permissions: [],
    roleKeys: ['guest'],
  );
}

/// A food API with no outlets, so the demo menu shows, and no real calls.
class _NoOutletsApi extends OrdersApi {
  _NoOutletsApi() : super(ApiClient(baseUrl: 'http://invalid.test', token: () => null));
  @override
  Future<List<Outlet>> outlets() async => const [];
  @override
  Future<List<Order>> mine() async => const [];
  @override
  Future<Map<String, ItemStars>> stars() async => const {};
  @override
  Future<List<DeliveryZone>> zones() async => const [];
}

/// Lets screens, sheets and toasts finish moving (the app has looping
/// animations, so pumpAndSettle would never return).
Future<void> _settle(WidgetTester tester, {int seconds = 1}) async {
  for (var i = 0; i < seconds * 10; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  testWidgets('a guest adds a demo dish, checks out and the order is placed', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [
        sessionProvider.overrideWith(_Guest.new),
        ordersApiProvider.overrideWithValue(_NoOutletsApi()),
      ],
    );
    await tester.pump(const Duration(milliseconds: 500));
    // Step 1: the demo menu shows, labelled, with the guest bar (5 tabs).
    expect(find.textContaining('Demo menu'), findsOneWidget);
    for (final tab in ['Home', 'Food', 'Bookings', 'Cart', 'Me']) {
      expect(find.text(tab), findsWidgets);
    }
    // Step 2: tap a dish and add it.
    await tester.tap(find.text('Rolex'));
    await _settle(tester);
    await tester.tap(find.textContaining('Add UGX'));
    await _settle(tester);
    // Step 3: the cart tab holds it.
    await tester.tap(find.text('Cart').last);
    await _settle(tester);
    expect(find.text('Rolex'), findsOneWidget);
    // Step 4: check out, choose takeaway, place the order.
    await tester.tap(find.text('Check out'));
    await _settle(tester);
    await tester.tap(find.text('Takeaway'));
    await _settle(tester);
    await tester.tap(find.text('Place order'));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.textContaining('Demo order DEMO-0001 placed'), findsOneWidget);
    // Step 5: the cart is empty again.
    await _settle(tester, seconds: 5);
    expect(find.text('Your cart is empty'), findsOneWidget);
  });

  testWidgets('food search shows an empty state, and a section chip narrows the dishes', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [
        sessionProvider.overrideWith(_Guest.new),
        ordersApiProvider.overrideWithValue(_NoOutletsApi()),
      ],
    );
    await _settle(tester);
    // A chip narrows the grid to its section (Drinks has the passion juice only).
    await tester.tap(find.widgetWithText(ChoiceChip, 'Drinks'));
    await _settle(tester);
    expect(find.text('Fresh passion juice'), findsOneWidget);
    expect(find.text('Rolex'), findsNothing);
    // A search with no match says so.
    await tester.tap(find.widgetWithText(ChoiceChip, 'All'));
    await tester.enterText(find.byType(TextField), 'zzzz');
    await _settle(tester);
    expect(find.text('No dish matches your search.'), findsOneWidget);
    // The out-of-stock dish shows last in the "Not available" card when searching for it.
    await tester.enterText(find.byType(TextField), 'luwombo');
    await _settle(tester);
    expect(find.text('NOT AVAILABLE'), findsOneWidget);
  });
}
