// The kinds of stock movement staff post from the app, with their words and
// which stores each needs.

/// One kind of movement.
enum MoveKind {
  /// Goods arrive into a store.
  receive('Receive goods', from: false, to: true),

  /// Stock leaves a store for a person or department.
  issue('Issue stock', from: true, to: false),

  /// Stock moves between two stores.
  transfer('Transfer', from: true, to: true),

  /// Breakage, spoilage or expiry.
  waste('Record waste', from: true, to: false);

  const MoveKind(this.label, {required this.from, required this.to});

  /// The button and title words.
  final String label;

  /// Needs the store it leaves.
  final bool from;

  /// Needs the store it enters.
  final bool to;
}
