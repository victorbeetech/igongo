// The curved edge of the Auth header: a smooth, symmetrical white dip drawn
// with one quadratic Bézier curve. Everything below the curve is kept, so the
// white section starts under the photo and continues into the form.

import 'package:material_ui/material_ui.dart';

/// Clips a box to the area below a gentle curve across its width.
class IgongoCurveClipper extends CustomClipper<Path> {
  /// Creates the clipper. It has no settings: the curve is fixed by the design.
  const IgongoCurveClipper();

  @override
  Path getClip(Size size) {
    // Step 1: start at the left edge, at 79% of the height.
    final path = Path()..moveTo(0, size.height * 0.79);
    // Step 2: one quadratic curve dips to 91% in the middle and comes back up to 79% at the right edge.
    path.quadraticBezierTo(size.width * 0.50, size.height * 0.91, size.width, size.height * 0.79);
    // Step 3: close the shape along the bottom, so the white fills everything below the curve.
    path
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    return path;
  }

  @override
  bool shouldReclip(covariant IgongoCurveClipper oldClipper) => false;
}
