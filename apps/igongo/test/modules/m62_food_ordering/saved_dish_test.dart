// Reads one saved dish from the API's JSON, with today's name, price and availability.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m62_food_ordering/domain/saved_dish.dart';

void main() {
  test('reads a saved dish, including a dish that is off today', () {
    final d = SavedDish.fromJson({'itemId': 'eshabwe', 'outlet': 'main', 'name': 'Eshabwe', 'price': 25000, 'available': false});
    expect(d.itemId, 'eshabwe');
    expect(d.name, 'Eshabwe');
    expect(d.price, 25000);
    expect(d.available, isFalse);
  });
}
