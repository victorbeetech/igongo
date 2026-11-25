// One tile on a role's home screen.

/// One tile on a role's home screen.
class RoleTile {
  /// Creates a tile with its label and the screen it opens.
  const RoleTile(this.label, this.screenId);

  /// The words on the tile.
  final String label;

  /// The screen number the tile opens.
  final String screenId;
}
