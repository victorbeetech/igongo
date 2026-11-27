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

  /// The same line with [quantity] changed (the screen's +/- buttons use this).
  CartLine withQuantity(int quantity) => CartLine(
    itemId: itemId,
    name: name,
    quantity: quantity,
    options: options,
    unitPrice: unitPrice,
  );

  /// What this line costs: its unit price times how many.
  int get lineTotal => unitPrice * quantity;

  /// The line as the API takes it.
  Map<String, Object> toJson() => {'itemId': itemId, 'quantity': quantity, 'options': options};
}
