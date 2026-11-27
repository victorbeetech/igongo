// Clips a box so its bottom edge is a soft wave, as on the Igongo headers.
// Used by any screen that wants the curved bottom edge of the brand design.

import 'package:material_ui/material_ui.dart';

/// A clipper whose bottom edge curves up and down across the width.
class WaveClipper extends CustomClipper<Path> {
  /// Creates the clipper.
  const WaveClipper();

  @override
  Path getClip(Size size) {
    // Step 1: start at the top left and go down the left side to where the wave starts.
    final path = Path()..lineTo(0, size.height - 28);
    // Step 2: two gentle curves across the bottom, dipping at the middle and rising at the right.
    path
      ..quadraticBezierTo(size.width * 0.25, size.height, size.width * 0.5, size.height - 14)
      ..quadraticBezierTo(size.width * 0.75, size.height - 28, size.width, size.height - 6);
    // Step 3: up the right side and close the shape back at the top left.
    return path
      ..lineTo(size.width, 0)
      ..close();
  }

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}
