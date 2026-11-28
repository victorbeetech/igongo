// The Price Range section: the histogram, the dual slider and the two price boxes.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import '../../domain/refine_price_range.dart';
import 'refine_histogram.dart';
import 'refine_price_bounds.dart';
import 'refine_range_slider.dart';
import 'refine_section_card.dart';

/// The Price Range card.
class RefinePriceCard extends StatelessWidget {
  /// Creates the card for [price], with the slider at [values]. [onChanged] runs as a handle moves.
  const RefinePriceCard({super.key, required this.price, required this.values, required this.onChanged});

  /// The histogram, the price labels and where the handles start.
  final RefinePriceRange price;

  /// The two handle positions, from 0 to 1.
  final RangeValues values;

  /// Called as a handle moves.
  final ValueChanged<RangeValues> onChanged;

  @override
  Widget build(BuildContext context) => RefineSectionCard(
    title: 'Price Range (UGX)',
    trailing: Text(
      'Per Night / Experience',
      style: context.text.labelSmall!.copyWith(color: context.palette.accent, fontWeight: FontWeight.w600),
    ),
    gap: IgongoSpace.md,
    // Step 1: the histogram, the slider, then the two price boxes.
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.xs,
      children: [
        RefineHistogram(bars: price.bars),
        RefineRangeSlider(values: values, onChanged: onChanged),
        RefinePriceBounds(minLabel: price.minLabel, maxLabel: price.maxLabel),
      ],
    ),
  );
}
