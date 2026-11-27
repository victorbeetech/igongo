// One tile on the Bookings home: what it is called, its icon, its picture and
// the screen it opens.

import 'package:material_ui/material_ui.dart';

/// A booking category tile.
class BookingCategory {
  /// Creates a tile that opens [screenId] with [label] and [icon]; [photo] is its picture (a placeholder when null).
  const BookingCategory({required this.screenId, required this.label, required this.icon, this.photo});

  /// The screen number it opens, such as `S67-02`.
  final String screenId;

  /// The words on the tile.
  final String label;

  /// The icon on the tile.
  final IconData icon;

  /// The tile's picture (asset path or address), or null for the placeholder.
  final String? photo;
}
