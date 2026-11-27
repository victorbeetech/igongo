// One tile in the Resort Experiences grid on the Bookings tab: its name, a
// short line under it, its icon, its picture and the screen it opens.

import 'package:material_ui/material_ui.dart';

/// A resort experience tile.
class ResortExperience {
  /// Creates a tile. [screenId] is the screen it opens, or null when no screen exists yet.
  const ResortExperience({
    required this.label,
    required this.caption,
    required this.icon,
    this.screenId,
    this.photo,
  });

  /// The tile's name, such as `Spa & Sauna`.
  final String label;

  /// The short line under the name (a description, not a price).
  final String caption;

  /// The icon beside the name.
  final IconData icon;

  /// The screen number it opens, such as `S72-01`; null when that experience has no screen yet.
  final String? screenId;

  /// The tile's picture (asset path), or null for the placeholder until the hotel sends one.
  final String? photo;
}
