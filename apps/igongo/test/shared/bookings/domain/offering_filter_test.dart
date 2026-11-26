// The room filter: price range and room types, on the offerings the API sent.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/shared/bookings/domain/offering.dart';
import 'package:igongo/shared/bookings/domain/offering_filter.dart';

Offering _room(String name, int price) =>
    Offering(id: name, kind: 'nights', name: name, price: price, capacity: 1, slots: const []);

void main() {
  final rooms = [_room('Standard Room', 180000), _room('Deluxe Room', 250000), _room('Executive Suite', 350000)];

  test('an empty filter keeps every offering', () {
    expect(const OfferingFilter().isEmpty, isTrue);
    expect(const OfferingFilter().apply(rooms), rooms);
  });

  test('the price range keeps offerings from the low to the high end', () {
    const f = OfferingFilter(minPrice: 200000, maxPrice: 300000);
    expect(f.apply(rooms).map((o) => o.name), ['Deluxe Room']);
  });

  test('no upper limit keeps everything above the low end', () {
    const f = OfferingFilter(minPrice: 200000);
    expect(f.apply(rooms).map((o) => o.name), ['Deluxe Room', 'Executive Suite']);
  });

  test('room types match by word in the name, ignoring case', () {
    const f = OfferingFilter(types: {'standard', 'Suite'});
    expect(f.apply(rooms).map((o) => o.name), ['Standard Room', 'Executive Suite']);
  });

  test('price and type filters combine', () {
    const f = OfferingFilter(minPrice: 200000, types: {'Suite'});
    expect(f.apply(rooms).map((o) => o.name), ['Executive Suite']);
  });
}
