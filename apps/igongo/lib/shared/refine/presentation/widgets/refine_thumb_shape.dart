// The round handle of the price slider: a white disc with a soft shadow and a red dot in the middle.

import 'package:material_ui/material_ui.dart';

/// Draws one slider handle. The colours come from the theme palette, passed in by the slider.
class RefineThumbShape extends RangeSliderThumbShape {
  /// Creates the handle. [fill] is the disc, [dot] the centre, [shadow] the soft shadow under it.
  const RefineThumbShape({required this.fill, required this.dot, required this.shadow});

  /// The colour of the white disc.
  final Color fill;

  /// The colour of the dot in the middle.
  final Color dot;

  /// The colour the shadow is cast in.
  final Color shadow;

  /// The disc radius, so the handle is 24 across.
  static const double _radius = 12;

  /// The dot radius, so the dot is 10 across.
  static const double _dotRadius = 5;

  @override
  Size getPreferredSize(bool isEnabled, bool isDiscrete) => const Size.fromRadius(_radius);

  @override
  void paint(
    PaintingContext context,
    Offset center, {
    required Animation<double> activationAnimation,
    required Animation<double> enableAnimation,
    bool isDiscrete = false,
    bool isEnabled = false,
    bool isOnTop = false,
    TextDirection textDirection = TextDirection.ltr,
    required SliderThemeData sliderTheme,
    Thumb thumb = Thumb.start,
    bool isPressed = false,
  }) {
    final canvas = context.canvas;
    // Step 1: the shadow, cast by the disc's outline.
    canvas.drawShadow(Path()..addOval(Rect.fromCircle(center: center, radius: _radius)), shadow, 3, true);
    // Step 2: the white disc, then the red dot on top of it.
    canvas.drawCircle(center, _radius, Paint()..color = fill);
    canvas.drawCircle(center, _dotRadius, Paint()..color = dot);
  }
}
