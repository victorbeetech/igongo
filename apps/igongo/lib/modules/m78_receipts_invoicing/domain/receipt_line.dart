// One manifest line on a receipt: what was bought and what it cost.

/// A single bought item on a receipt.
class ReceiptLine {
  /// Creates a manifest line.
  const ReceiptLine({required this.name, required this.detail, required this.amount});

  /// The item's name, such as "Flame-Grilled Tilapia".
  final String name;

  /// A short description under the name.
  final String detail;

  /// The price in whole shillings.
  final int amount;
}
