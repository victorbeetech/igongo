// The filter categories of the Updates screen, in the order the tabs show them.

/// A category of update, shown as one filter tab.
enum UpdateCategory {
  /// Every update, whatever its category.
  all('All'),

  /// Room service, spa and other orders and stays.
  ordersStays('Orders & Stays'),

  /// Offers and promotions.
  promos('Promos'),

  /// News from around the resort.
  resortNews('Resort News');

  /// Creates a category with the words on its tab.
  const UpdateCategory(this.label);

  /// The words on the filter tab.
  final String label;
}
