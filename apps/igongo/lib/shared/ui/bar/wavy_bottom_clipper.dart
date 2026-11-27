// Cuts a widget's bottom edge into a soft wave, so the page below seems to rise
// into it in a curve (the Bookings home picture).

import 'package:material_ui/material_ui.dart';

/// Clips to a rectangle whose bottom edge is a soft wave (about 28 px high).
class WavyBottomClipper extends CustomClipper<Path> {
  /// Creates the clipper.
  const WavyBottomClipper();

  @override
  Path getClip(Size size) => Path()
    // Step 1: down the left side to the start of the wave.
    ..lineTo(0, size.height - 24)
    // Step 2: the wavy bottom edge, left to right.
    ..quadraticBezierTo(size.width * 0.25, size.height + 4, size.width * 0.55, size.height - 14)
    ..quadraticBezierTo(size.width * 0.8, size.height - 28, size.width, size.height - 8)
    // Step 3: up the right side and across the top.
    ..lineTo(size.width, 0)
    ..close();

  @override
  bool shouldReclip(WavyBottomClipper oldClipper) => false;
}
