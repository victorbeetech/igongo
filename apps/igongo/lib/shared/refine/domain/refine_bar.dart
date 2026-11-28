// One bar of the price histogram: how tall it stands and which colour it takes.

import 'package:material_ui/material_ui.dart';

/// One bar in the price histogram.
@immutable
class RefineBar {
  /// Creates a bar. [fraction] is its height from 0 to 1 of the histogram.
  const RefineBar({required this.fraction, this.accent = false, this.opacity = 1});

  /// The height of the bar, from 0 (none) to 1 (the full histogram height).
  final double fraction;

  /// True for the amber bars at the edges; false for Igongo red.
  final bool accent;

  /// How strong the colour is, from 0 (faint) to 1 (full).
  final double opacity;
}
