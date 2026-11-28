// The price section of the Filter & Refine screen: the histogram, the two ends
// of the slider and the words for the minimum and maximum.

import 'package:material_ui/material_ui.dart';

import 'refine_bar.dart';

/// The price range: the histogram bars, where the slider handles start and the two price labels.
@immutable
class RefinePriceRange {
  /// Creates the price section. [low] and [high] are slider positions from 0 to 1.
  const RefinePriceRange({
    required this.minLabel,
    required this.maxLabel,
    required this.low,
    required this.high,
    required this.bars,
  });

  /// The words under MINIMUM (a dash until the API sends prices).
  final String minLabel;

  /// The words under MAXIMUM (a dash until the API sends prices).
  final String maxLabel;

  /// Where the lower handle starts, from 0 (left) to 1 (right).
  final double low;

  /// Where the upper handle starts, from 0 (left) to 1 (right).
  final double high;

  /// The histogram bars, left to right.
  final List<RefineBar> bars;
}
