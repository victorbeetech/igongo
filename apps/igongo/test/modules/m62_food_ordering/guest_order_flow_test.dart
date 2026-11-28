// End to end as a signed-in guest on one venue ("Main restaurant", served by the
// fake food API with one test dish as its menu): open the food shop, add a
// dish, open the cart, check out and place the order. The session and the food
// API are faked, so nothing is sent anywhere. The dish and zone below are test
// fixtures only; the app never shows them to a real person.

import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/application/orders_providers.dart';
import 'package:igongo/modules/m62_food_ordering/data/orders_api.dart';
import 'package:igongo/modules/m62_food_ordering/domain/cart_quote.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_sheet.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/food_home/dish_card.dart';
import 'package:igongo/modules/m62_food_ordering/domain/menu_item.dart';
import 'package:igongo/modules/m62_food_ordering/domain/ordering_rules.dart';
import 'package:igongo/modules/m62_food_ordering/domain/type_rule.dart';
import 'package:igongo/modules/m62_food_ordering/domain/delivery_zone.dart';
import 'package:igongo/modules/m62_food_ordering/domain/item_stars.dart';
import 'package:igongo/modules/m62_food_ordering/domain/option_choice.dart';
import 'package:igongo/modules/m62_food_ordering/domain/option_group.dart';
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

/// The one venue the fake food API serves.
const _venueKey = 'main';

/// The add-on group on the test dishes: one optional drink (passion juice or soda).
const _drinkAddOn = OptionGroup(
  key: 'drink',
  name: 'Add a drink',
  required: false,
  multiple: false,
  choices: [
    OptionChoice(key: 'passion', name: 'Passion juice', priceDelta: 6000),
    OptionChoice(key: 'soda', name: 'Soda', priceDelta: 3000),
  ],
);

/// The test menu: two grill and snack dishes with the optional drink, a drink, and one dish out today.
const _menu = <MenuItem>[
  MenuItem(
    id: 'test-tilapia',
    section: 'Grill',
    name: 'Grilled tilapia',
    price: 28000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['fish'],
    description: 'Whole tilapia on the grill with greens.',
  ),
  MenuItem(
    id: 'test-rolex',
    section: 'Snacks',
    name: 'Rolex',
    price: 5000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['egg', 'gluten'],
  ),
  MenuItem(
    id: 'test-passion',
    section: 'Drinks',
    name: 'Fresh passion juice',
    price: 6000,
    available: true,
    options: [],
    allergens: [],
  ),
  MenuItem(
    id: 'test-luwombo',
    section: 'Local',
    name: 'Chicken luwombo',
    price: 35000,
    available: false,
    options: [],
    allergens: ['nuts'],
  ),
];

/// The one test delivery zone the fake food API serves.
const _zones = <DeliveryZone>[DeliveryZone(zone: 'test-grounds', name: 'Lodge grounds', fee: 3000, minutes: 20)];

/// A food API with one venue ("Main restaurant") that takes dine-in, takeaway and
/// delivery, with a 1,000 container fee. Prices and orders are made up here, and
/// nothing is sent to a server.
class _OneVenueApi extends OrdersApi {
  _OneVenueApi() : super(ApiClient(baseUrl: 'http://invalid.test', token: () => null));
  @override
  Future<List<Outlet>> outlets() async => const [Outlet(key: _venueKey, name: 'Main restaurant')];
  @override
  Future<List<MenuItem>> menu(String outlet) async => outlet == _venueKey ? _menu : const [];
  @override
  Future<OrderingRules> rules() async => const OrderingRules(
    types: {
      'dine_in': TypeRule(enabled: true, outlets: [], payment: 'later'),
      'takeaway': TypeRule(enabled: true, outlets: [], payment: 'later'),
      'delivery': TypeRule(enabled: true, outlets: [], payment: 'later'),
    },
    preorderMinNoticeMinutes: 60,
    containerFee: 1000,
  );
  @override
  Future<CartQuote> quote(Json body) async {
    // The container fee is added only for takeaway, as the server does.
    final container = body['type'] == 'takeaway' ? 1000 : 0;
    return CartQuote(subtotal: 5000, discount: 0, deliveryFee: 0, containerFee: container, total: 5000 + container, readyAt: '');
  }
  @override
  Future<Order> place(Json body) async => Order.fromJson({
    'id': 'ord_test_1',
    'number': 'F-0001',
    'outlet': _venueKey,
    'type': body['type'],
    'status': 'placed',
    'lines': const <Map<String, Object?>>[],
    'total': 5000,
    'paid': 0,
    'readyAt': '',
    'discount': 0,
    'rated': false,
  });
  @override
  Future<List<Order>> mine() async => const [];
  @override
  Future<Map<String, ItemStars>> stars() async => const {};
  @override
  Future<List<DeliveryZone>> zones() async => _zones;
}

/// Lets screens, sheets and toasts finish moving (the app has looping
/// animations, so pumpAndSettle would never return).
Future<void> _settle(WidgetTester tester, {int seconds = 1}) async {
  for (var i = 0; i < seconds * 10; i++) {
    await tester.pump(const Duration(milliseconds: 100));
  }
}

/// Opens the food shop as a guest and taps the Rolex card, which goes straight to checkout.
Future<void> _openCheckout(WidgetTester tester) async {
  usePhoneWindow(tester);
  await openApp(
    tester,
    '/food-ordering/food-home',
    preview: false,
    overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
  );
  await _settle(tester);
  await tester.tap(find.text('Rolex'));
  await _settle(tester);
}

/// Finds [text] inside the open checkout sheet only (the food screen behind it shows the same words).
Finder _inSheet(String text) => find.descendant(of: find.byType(CheckoutSheet), matching: find.text(text));

/// Scrolls [finder] into view inside the checkout sheet, then taps it.
Future<void> _tapVisible(WidgetTester tester, Finder finder) async {
  await tester.ensureVisible(finder);
  await tester.pump(const Duration(milliseconds: 200));
  await tester.tap(finder);
  await _settle(tester);
}

void main() {
  testWidgets('tapping a dish card checks out that dish, and the order is placed', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
    );
    await tester.pump(const Duration(milliseconds: 500));
    // Step 1: the menu shows its dishes, with the guest bar (5 tabs).
    expect(find.text('Rolex'), findsOneWidget);
    for (final tab in ['Home', 'Food', 'Bookings', 'Cart', 'Me']) {
      expect(find.text(tab), findsWidgets);
    }
    // Step 2: tapping the card opens checkout for that dish straight away (no cart step).
    await tester.tap(find.text('Rolex'));
    await _settle(tester);
    expect(find.text('Proceed to Checkout'), findsNothing);
    // Step 3: choose takeaway, place the order.
    await tester.tap(_inSheet('Takeaway'));
    await _settle(tester);
    await tester.tap(_inSheet('Place order'));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.textContaining('Order F-0001 placed'), findsOneWidget);
    // Step 4: the cart is empty again.
    await _settle(tester, seconds: 5);
    await tester.tap(find.text('Cart').last);
    await _settle(tester);
    expect(find.text('Your cart is empty'), findsOneWidget);
  });

  testWidgets('food search shows an empty state, and a section chip narrows the dishes', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
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
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
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
    // A pushed page (Spa, opened from the Explore tile below the quick actions) keeps its Back arrow.
    await tester.tap(find.text('Home').last);
    await _settle(tester);
    await tester.scrollUntilVisible(find.text('Spa').last, 200, scrollable: find.byType(Scrollable).first);
    // Lift it clear of the bottom bar before tapping.
    await tester.drag(find.byType(Scrollable).first, const Offset(0, -150));
    await _settle(tester);
    await tester.tap(find.text('Spa').last);
    await _settle(tester);
    expect(find.byType(BackButton), findsOneWidget);
  });

  testWidgets('the item page previews the dish, offers optional add-ons and a note, and Order now checks it out', (
    tester,
  ) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
    );
    await _settle(tester);
    // Two dishes sit side by side in the grid (same row).
    final a = tester.getTopLeft(find.text('Grilled tilapia')).dy;
    final b = tester.getTopLeft(find.text('Rolex')).dy;
    expect(a, b);
    // The item page has a Back arrow, optional add-ons and an optional note. Its View button opens it (the card itself checks out).
    await tester.tap(find.descendant(of: find.widgetWithText(DishCard, 'Grilled tilapia'), matching: find.text('View')));
    await _settle(tester);
    expect(find.byType(BackButton), findsOneWidget);
    expect(find.text('Add a drink'), findsOneWidget);
    expect(find.text('Special instructions'), findsOneWidget);
    // Nothing is compulsory: add with an add-on and a note.
    await tester.tap(find.textContaining('Passion juice'));
    await tester.enterText(find.byType(TextField), 'no tomatoes');
    await _settle(tester);
    // Order now skips the cart: checkout opens with this dish, its add-on, its note and the total.
    await tester.tap(find.textContaining('Order now'));
    await _settle(tester);
    expect(find.byType(CheckoutSheet), findsOneWidget);
    expect(find.text('Grilled tilapia'), findsOneWidget);
    expect(find.textContaining('UGX 34,000'), findsWidgets);
  });

  testWidgets('the cart button adds a dish to the cart and stays on the list', (tester) async {
    usePhoneWindow(tester);
    await openApp(
      tester,
      '/food-ordering/food-home',
      preview: false,
      overrides: [sessionProvider.overrideWith(_Guest.new), ordersApiProvider.overrideWithValue(_OneVenueApi())],
    );
    await _settle(tester);
    // One tap on the cart button adds the Rolex and shows a confirmation, with no checkout sheet.
    await tester.tap(find.byTooltip('Add Rolex to cart'));
    await _settle(tester);
    expect(find.text('Rolex added to your cart.'), findsOneWidget);
    expect(find.text('Proceed to Checkout'), findsNothing);
    // The cart tab holds it.
    await tester.tap(find.text('Cart').last);
    await _settle(tester);
    expect(find.text('Rolex'), findsOneWidget);
  });

  testWidgets('dine-in must ask what time before ordering', (tester) async {
    await _openCheckout(tester);
    await _tapVisible(tester, _inSheet('Dine-in'));
    expect(find.text('What time are you coming?'), findsOneWidget);
    // A table is needed too; with it typed, the order still waits for a time.
    await tester.enterText(find.widgetWithText(TextField, 'Table'), '4');
    await _tapVisible(tester, _inSheet('Place order'));
    expect(find.text('Choose what time you are coming.'), findsOneWidget);
  });

  testWidgets('takeaway shows the container price (when the super admin set one) in the total', (tester) async {
    await _openCheckout(tester);
    expect(find.textContaining('About UGX 5,000 before delivery'), findsOneWidget);
    await _tapVisible(tester, _inSheet('Takeaway'));
    expect(find.textContaining('Container +UGX 1,000'), findsOneWidget);
    expect(find.textContaining('About UGX 6,000 before delivery (container included)'), findsOneWidget);
  });

  testWidgets('delivery asks the guest to confirm the location before ordering', (tester) async {
    await _openCheckout(tester);
    await _tapVisible(tester, _inSheet('Delivery'));
    await _tapVisible(tester, find.textContaining('Lodge grounds'));
    await tester.enterText(find.widgetWithText(TextField, 'Where to deliver'), 'Pool terrace');
    await _settle(tester);
    // Not confirmed yet: the order is refused.
    await _tapVisible(tester, _inSheet('Place order'));
    expect(find.text('Confirm the delivery location.'), findsOneWidget);
    // Confirm the location, then the order goes through.
    await _tapVisible(tester, find.textContaining('Confirm delivery to Lodge grounds: Pool terrace'));
    await _tapVisible(tester, _inSheet('Place order'));
    expect(find.textContaining('Order F-0001 placed'), findsOneWidget);
  });
}
