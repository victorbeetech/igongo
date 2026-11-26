// Cuts a widget's top edge into a gentle wave, for the guest bottom bar.

import 'package:material_ui/material_ui.dart';

/// Clips to a rectangle whose top edge is a soft wave (about 14 px high).
class WavyTopClipper extends CustomClipper<Path> {
  /// Creates the clipper.
  const WavyTopClipper();

  @override
  Path getClip(Size size) => Path()
    // Step 1: the wavy top edge, left to right.
    ..moveTo(0, 12)
    ..quadraticBezierTo(size.width * 0.25, -2, size.width * 0.5, 8)
    ..quadraticBezierTo(size.width * 0.75, 18, size.width, 4)
    // Step 2: down the right side, across the bottom and back up.
    ..lineTo(size.width, size.height)
    ..lineTo(0, size.height)
    ..close();

  @override
  bool shouldReclip(WavyTopClipper oldClipper) => false;
}
