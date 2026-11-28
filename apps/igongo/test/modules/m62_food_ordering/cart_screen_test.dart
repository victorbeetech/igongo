// Tests for the guest food cart and the live menu data behind it.
// Every test here uses fake live data: a mock HTTP client returns the same JSON
// shapes the real food API sends, so no test needs the network or the server.

import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:igongo/modules/m62_food_ordering/application/orders_providers.dart';
import 'package:igongo/shared/api/api_client.dart';
import 'package:igongo/shared/session/session_controller.dart';

import '../../support/open_app.dart';

/// A fake API client whose responses come from [routes] (path to JSON body).
/// A path with no route answers 404, so a test fails loudly on an unexpected call.
ApiClient _fakeApi(Map<String, Object> routes) => ApiClient(
  baseUrl: 'https://api.test',
  token: () => 'test-token',
  client: MockClient((request) async {
    final body = routes[request.url.path];
    if (body == null) return http.Response('not found', 404);
    return http.Response(jsonEncode(body), 200, headers: {'content-type': 'application/json'});
  }),
);

/// Overrides that point the food providers at [api].
List<Override> _liveFood(ApiClient api) => [apiClientProvider.overrideWithValue(api)];

void main() {
  testWidgets('an empty cart shows the empty state and a way to the food shop', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/food-ordering/cart', preview: false);
    expect(find.text('Your cart is empty'), findsOneWidget);
    expect(find.text('Browse Services'), findsOneWidget);
  });

  testWidgets('the wishlist heart on the banner toggles between saved and not saved', (tester) async {
    usePhoneWindow(tester);
    await openApp(tester, '/food-ordering/cart', preview: false);
    // Step 1: the heart starts off, offering to save.
    expect(find.byTooltip('Save to wishlist'), findsOneWidget);
    // Step 2: one tap saves it, and the label flips to offer removal.
    await tester.tap(find.byTooltip('Save to wishlist'));
    await tester.pump();
    expect(find.byTooltip('Remove from wishlist'), findsOneWidget);
    // Step 3: a second tap turns it off again.
    await tester.tap(find.byTooltip('Remove from wishlist'));
    await tester.pump();
    expect(find.byTooltip('Save to wishlist'), findsOneWidget);
  });

  test('the outlet list and its menu come from the live API', () async {
    final api = _fakeApi({
      '/api/menu/outlets': {
        'items': [
          {'key': 'restaurant', 'name': 'Restaurant'},
        ],
      },
      '/api/menu/items': {
        'items': [
          {'id': 'i1', 'section': 'Grill', 'name': 'Rolex', 'price': 5000, 'available': true},
          {'id': 'i2', 'section': 'Grill', 'name': 'Goat', 'price': 9000, 'available': false},
        ],
      },
    });
    final container = ProviderContainer(overrides: _liveFood(api));
    addTearDown(container.dispose);

    final outlets = await container.read(outletsProvider.future);
    expect(outlets.map((o) => o.key), ['restaurant']);

    final menu = await container.read(menuProvider('restaurant').future);
    expect(menu.map((i) => i.name), ['Rolex', 'Goat']);
    expect(menu.firstWhere((i) => i.name == 'Goat').available, isFalse);
  });

  test('my orders come only from the live API, with no local stand-ins', () async {
    final api = _fakeApi({'/api/orders/mine': {'items': <Object>[]}});
    final container = ProviderContainer(overrides: _liveFood(api));
    addTearDown(container.dispose);

    expect(await container.read(myOrdersProvider.future), isEmpty);
  });
}
