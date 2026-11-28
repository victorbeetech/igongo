// The dual price slider: two handles on one track, with the red bar between them.
// It is a real range slider, so it moves once the filter is wired in.

import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';
import 'refine_thumb_shape.dart';

/// The price range slider, from 0 (the lowest price) to 1 (the highest).
class RefineRangeSlider extends StatelessWidget {
  /// Creates the slider at [values]. [onChanged] runs as a handle moves.
  const RefineRangeSlider({super.key, required this.values, required this.onChanged});

  /// The two handle positions, from 0 to 1.
  final RangeValues values;

  /// Called with the new positions as a handle moves.
  final ValueChanged<RangeValues> onChanged;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the track and handles take the palette colours; the touch overlay is switched off to keep the look.
    return SliderTheme(
      data: SliderTheme.of(context).copyWith(
        trackHeight: 8,
        activeTrackColor: palette.primary,
        inactiveTrackColor: palette.surfaceAlt,
        rangeTrackShape: const RoundedRectRangeSliderTrackShape(),
        rangeThumbShape: RefineThumbShape(fill: palette.surface, dot: palette.primary, shadow: palette.text),
        overlayShape: SliderComponentShape.noOverlay,
        showValueIndicator: ShowValueIndicator.never,
      ),
      // Step 2: the slider itself, covering the whole price scale.
      child: RangeSlider(values: values, min: 0, max: 1, onChanged: onChanged),
    );
  }
}
