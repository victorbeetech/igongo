// Global search (S00-25): the server's JSON becomes the app's results, and a
// missing list or a missing availability flag is read safely.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/domain/menu_search_results.dart';

void main() {
  test('reads dishes and outlets from the API JSON', () {
    final results = MenuSearchResults.fromJson({
      'items': [
        {'id': 'itm_1', 'outlet': 'main', 'section': 'Grill', 'name': 'Fried beef', 'price': 20000, 'available': true, 'photoUrl': null},
        {'id': 'itm_2', 'outlet': 'main', 'section': 'Grill', 'name': 'Beef tikka', 'price': 18000, 'available': false},
      ],
      'outlets': [
        {'key': 'main', 'name': 'Main restaurant'},
      ],
    });

    expect(results.items.map((i) => i.name), ['Fried beef', 'Beef tikka']);
    expect(results.items.last.available, isFalse);
    expect(results.items.first.price, 20000);
    expect(results.outlets.single.name, 'Main restaurant');
    expect(results.isEmpty, isFalse);
  });

  test('a missing list counts as empty, and a missing flag counts as on sale', () {
    final empty = MenuSearchResults.fromJson({});
    expect(empty.isEmpty, isTrue);

    final item = MenuSearchResults.fromJson({
      'items': [
        {'id': 'itm_3', 'outlet': 'main', 'section': 'Sides', 'name': 'Chapati', 'price': 2000},
      ],
    }).items.single;
    expect(item.available, isTrue);
    expect(item.photoUrl, isNull);
  });
}
