// Unit tests for the search filter logic: outlets, availability, the highest price
// and the order. Pure functions, no widgets.

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/modules/m00_app_shell/domain/menu_search_results.dart';
import 'package:igongo/modules/m00_app_shell/domain/search_item_hit.dart';
import 'package:igongo/shared/search/domain/apply_search_filters.dart';
import 'package:igongo/shared/search/domain/search_filters.dart';
import 'package:igongo/shared/search/domain/search_sort.dart';

/// One dish hit for the tests.
SearchItemHit _dish(String id, String name, int price, {String outlet = 'kitchen', bool available = true}) =>
    SearchItemHit(id: id, outlet: outlet, section: 'Main', name: name, price: price, available: available);

void main() {
  final results = MenuSearchResults(
    items: [
      _dish('1', 'Tilapia', 28000),
      _dish('2', 'Matooke', 9000, outlet: 'lodge'),
      _dish('3', 'Luwombo', 22000, available: false),
      _dish('4', 'Eshabwe', 15000),
    ],
    outlets: const [],
  );
  List<String> names(MenuSearchResults r) => [for (final i in r.items) i.name];

  test('the default filter keeps every dish in the server order', () {
    expect(names(applySearchFilters(results, const SearchFilters())), ['Tilapia', 'Matooke', 'Luwombo', 'Eshabwe']);
  });

  test('the outlet choice keeps only that outlet', () {
    final out = applySearchFilters(results, const SearchFilters(outlets: {'lodge'}));
    expect(names(out), ['Matooke']);
  });

  test('on sale today only drops dishes that are off', () {
    final out = applySearchFilters(results, const SearchFilters(availableOnly: true));
    expect(names(out), ['Tilapia', 'Matooke', 'Eshabwe']);
  });

  test('the highest price drops dearer dishes', () {
    final out = applySearchFilters(results, const SearchFilters(maxPrice: 20000));
    expect(names(out), ['Matooke', 'Eshabwe']);
  });

  test('price sorts both ways and name sorts A to Z', () {
    expect(names(applySearchFilters(results, const SearchFilters(sort: SearchSort.priceLowToHigh))),
        ['Matooke', 'Eshabwe', 'Luwombo', 'Tilapia']);
    expect(names(applySearchFilters(results, const SearchFilters(sort: SearchSort.priceHighToLow))),
        ['Tilapia', 'Luwombo', 'Eshabwe', 'Matooke']);
    expect(names(applySearchFilters(results, const SearchFilters(sort: SearchSort.nameAtoZ))),
        ['Eshabwe', 'Luwombo', 'Matooke', 'Tilapia']);
  });

  test('outlets on the results are kept so the screen can still list them', () {
    final withOutlets = MenuSearchResults(items: results.items, outlets: const []);
    expect(applySearchFilters(withOutlets, const SearchFilters(availableOnly: true)).outlets, isEmpty);
  });

  test('isActive is false only for the default choices', () {
    expect(const SearchFilters().isActive, isFalse);
    expect(const SearchFilters(maxPrice: 5000).isActive, isTrue);
    expect(const SearchFilters(sort: SearchSort.nameAtoZ).isActive, isTrue);
  });
}
