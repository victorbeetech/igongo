// The filter groups on My receipts: each receipt belongs to one category.
// The pills show these in order, with "All" first.

/// A receipt's category, used by the filter pills.
enum ReceiptCategory {
  /// Dining: restaurants, cafes and bars.
  dining('Dining'),

  /// Stays: cottages and rooms.
  stays('Stays & Cottages'),

  /// Cultural tours: museum and heritage passes.
  tours('Cultural Tours'),

  /// Wellness: spa and pool.
  wellness('Spa & Pool');

  /// Creates a category with its filter [label].
  const ReceiptCategory(this.label);

  /// The words shown on the filter pill.
  final String label;
}
