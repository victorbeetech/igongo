// One line of the guest's cart before ordering. The API prices the cart
// again; [unitPrice] is only what the screen shows.

import '../../../shared/format/hotel_day.dart';

/// A cart line.
class CartLine {
  /// Creates a line. [date] is the day the guest wants it (null until chosen, e.g. after a reorder).
  const CartLine({
    required this.itemId,
    required this.name,
    required this.quantity,
    required this.options,
    required this.unitPrice,
    this.date,
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

  /// The day the guest wants this line (the hotel's day), or null when not chosen yet.
  final DateTime? date;

  /// A copy with any given field changed; the others stay as they are.
  CartLine _copy({int? quantity, DateTime? date}) => CartLine(
    itemId: itemId,
    name: name,
    quantity: quantity ?? this.quantity,
    options: options,
    unitPrice: unitPrice,
    date: date ?? this.date,
  );

  /// The same line with [quantity] changed (the screen's +/- buttons use this).
  CartLine withQuantity(int quantity) => _copy(quantity: quantity);

  /// The same line on [day] (the screen's date picker uses this).
  CartLine withDate(DateTime day) => _copy(date: day);

  /// What this line costs: its unit price times how many.
  int get lineTotal => unitPrice * quantity;

  /// The line as the API takes it (its day as YYYY-MM-DD, when chosen).
  Map<String, Object> toJson() => {
    'itemId': itemId,
    'quantity': quantity,
    'options': options,
    if (date case final d?) 'date': dayKey(d),
  };
}
