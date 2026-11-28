// The price section of the Filter & Refine screen: the two ends of the slider and
// the words for the lowest and highest price on the results.

import 'package:material_ui/material_ui.dart';


/// The price range: where the slider handles start and the two price labels.
@immutable
class RefinePriceRange {
  /// Creates the price section. [low] and [high] are slider positions from 0 to 1.
  const RefinePriceRange({
    required this.minLabel,
    required this.maxLabel,
    required this.low,
    required this.high,
  });

  /// The words under MINIMUM (the lowest dish price, formatted).
  final String minLabel;

  /// The words under MAXIMUM (the highest dish price, formatted).
  final String maxLabel;

  /// Where the lower handle starts, from 0 (left) to 1 (right).
  final double low;

  /// Where the upper handle starts, from 0 (left) to 1 (right).
  final double high;
}
