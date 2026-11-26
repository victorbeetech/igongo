// One line of the guest's cart before ordering. The API prices the cart
// again; [unitPrice] is only what the screen shows.

/// A cart line.
class CartLine {
  /// Creates a line.
  const CartLine({
    required this.itemId,
    required this.name,
    required this.quantity,
    required this.options,
    required this.unitPrice,
    this.note,
  });

  /// The menu item's ID.
  final String itemId;

  /// Its name.
  final String name;

  /// How many.
  final int quantity;

  /// Picks, as `group:choice` keys.
  final List<String> options;

  /// Shillings each, with options.
  final int unitPrice;

  /// The guest's note for the kitchen on this dish, such as "no tomatoes" (optional).
  final String? note;

  /// The line as the API takes it.
  Map<String, Object> toJson() => {'itemId': itemId, 'quantity': quantity, 'options': options, 'notes': ?note};
}
