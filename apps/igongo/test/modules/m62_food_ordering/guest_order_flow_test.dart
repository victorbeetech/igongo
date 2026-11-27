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

/// Opens the demo food shop as a guest, adds a Rolex, and opens checkout from the cart.
Future<void> _openCheckout(WidgetTester tester) async {
  usePhoneWindow(tester);
  await openApp(
    tester,
    '/food-ordering/food-home',
    preview: false,
    overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_NoOutletsApi())],
  );
  await _settle(tester);
  await tester.tap(find.text('Rolex'));
  await _settle(tester);
  await tester.tap(find.textContaining('Add UGX'));
  await _settle(tester);
  await tester.tap(find.text('Cart').last);
  await _settle(tester);
  await tester.tap(find.text('Proceed to Checkout'));
  await _settle(tester);
}

/// Scrolls [finder] into view inside the checkout sheet, then taps it.
Future<void> _tapVisible(WidgetTester tester, Finder finder) async {
  await tester.ensureVisible(finder);
  await tester.pump(const Duration(milliseconds: 200));
  await tester.tap(finder);
  await _settle(tester);
}

void main() {
  testWidgets('a guest adds a demo dish, checks out and the order is placed', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_NoOutletsApi())],
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
    await tester.tap(find.text('Proceed to Checkout'));
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
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_NoOutletsApi())],
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

  testWidgets('tabs show no Back arrow; a pushed page does', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_NoOutletsApi())],
    );
    await _settle(tester);
    // Home is a tab: no app bar, so no arrow.
    expect(find.byType(BackButton), findsNothing);
    // The Food tab, opened from the bar: no arrow.
    await tester.tap(find.text('Food').last);
    await _settle(tester);
    expect(find.text('Rolex'), findsOneWidget);
    expect(find.byType(BackButton), findsNothing);
    // The Cart tab: no arrow.
    await tester.tap(find.text('Cart').last);
    await _settle(tester);
    expect(find.text('Your cart is empty'), findsOneWidget);
    expect(find.byType(BackButton), findsNothing);
    // A pushed page (Spa, opened from a home tile) keeps its Back arrow.
    await tester.tap(find.text('Home').last);
    await _settle(tester);
    await tester.scrollUntilVisible(find.text('Spa'), 200, scrollable: find.byType(Scrollable).first);
    // Lift it clear of the bottom bar before tapping.
    await tester.drag(find.byType(Scrollable).first, const Offset(0, -150));
    await _settle(tester);
    await tester.tap(find.text('Spa'));
    await _settle(tester);
    expect(find.byType(BackButton), findsOneWidget);
  });

  testWidgets('the item page previews the dish, offers optional add-ons and a note, and adds them to the cart', (
    tester,
  ) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_NoOutletsApi())],
    );
    await _settle(tester);
    // Two dishes sit side by side in the grid (same row).
    final a = tester.getTopLeft(find.text('Grilled tilapia')).dy;
    final b = tester.getTopLeft(find.text('Rolex')).dy;
    expect(a, b);
    // The item page has a Back arrow, optional add-ons and an optional note.
    await tester.tap(find.text('Grilled tilapia'));
    await _settle(tester);
    expect(find.byType(BackButton), findsOneWidget);
    expect(find.text('Add a drink (optional)'), findsOneWidget);
    expect(find.text('Make it yours (optional)'), findsOneWidget);
    // Nothing is compulsory: add with an add-on and a note.
    await tester.tap(find.textContaining('Passion juice'));
    await tester.enterText(find.byType(TextField), 'no tomatoes');
    await _settle(tester);
    await tester.tap(find.textContaining('Add UGX'));
    await _settle(tester);
    await tester.tap(find.text('Cart').last);
    await _settle(tester);
    expect(find.text('Grilled tilapia'), findsOneWidget);
    expect(find.text('Note: no tomatoes'), findsOneWidget);
    expect(find.textContaining('UGX 34,000'), findsWidgets);
  });

  testWidgets('dine-in must ask what time before ordering', (tester) async {
    await _openCheckout(tester);
    await _tapVisible(tester, find.text('Dine-in'));
    expect(find.text('What time are you coming?'), findsOneWidget);
    // A table is needed too; with it typed, the order still waits for a time.
    await tester.enterText(find.widgetWithText(TextField, 'Table'), '4');
    await _tapVisible(tester, find.text('Place order'));
    expect(find.text('Choose what time you are coming.'), findsOneWidget);
  });

  testWidgets('takeaway shows the container price (when the super admin set one) in the total', (tester) async {
    await _openCheckout(tester);
    expect(find.textContaining('About UGX 5,000 before delivery'), findsOneWidget);
    await _tapVisible(tester, find.text('Takeaway'));
    expect(find.textContaining('Container +UGX 1,000'), findsOneWidget);
    expect(find.textContaining('About UGX 6,000 before delivery (container included)'), findsOneWidget);
  });

  testWidgets('delivery asks the guest to confirm the location before ordering', (tester) async {
    await _openCheckout(tester);
    await _tapVisible(tester, find.text('Delivery'));
    await _tapVisible(tester, find.textContaining('Lodge grounds'));
    await tester.enterText(find.widgetWithText(TextField, 'Where to deliver'), 'Pool terrace');
    await _settle(tester);
    // Not confirmed yet: the order is refused.
    await _tapVisible(tester, find.text('Place order'));
    expect(find.text('Confirm the delivery location.'), findsOneWidget);
    // Confirm the location, then the order goes through.
    await _tapVisible(tester, find.textContaining('Confirm delivery to Lodge grounds: Pool terrace'));
    await _tapVisible(tester, find.text('Place order'));
    expect(find.textContaining('Demo order DEMO-0001 placed'), findsOneWidget);
  });
}
