// The order the search results can be shown in. Chosen on the Filter & Refine
// screen and applied to the dish results.

/// One way to order the dish results.
enum SearchSort {
  /// The order the server sent (its own ranking).
  standard,

  /// Cheapest dish first.
  priceLowToHigh,

  /// Most expensive dish first.
  priceHighToLow,

  /// Dish names from A to Z.
  nameAtoZ;

  /// The words the Filter & Refine screen shows for this order.
  String get label => switch (this) {
    SearchSort.standard => 'Standard',
    SearchSort.priceLowToHigh => 'Price: Low to High',
    SearchSort.priceHighToLow => 'Price: High to Low',
    SearchSort.nameAtoZ => 'Name: A to Z',
  };
}
