// A clip with a wavy bottom edge, used on the red banners at the top of a
// screen (such as My profile). Everything below the wave is cut away, so the
// page background shows through.

import 'package:material_ui/material_ui.dart';

/// Clips a box to its top area with a gentle wave along the bottom edge.
class WaveEdgeClipper extends CustomClipper<Path> {
  /// Creates the clip. [depth] is how far the wave dips, in logical pixels.
  const WaveEdgeClipper({this.depth = 28});

  /// How far the wave dips from the bottom edge, in logical pixels.
  final double depth;

  @override
  Path getClip(Size size) {
    // Step 1: start at the top-left corner, then go down the left side to where the wave begins.
    final w = size.width;
    final h = size.height;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(0, h - depth);
    // Step 2: two smooth curves make the wave: down under the left half, then up on the right.
    path
      ..quadraticBezierTo(w * 0.25, h + depth * 0.2, w * 0.5, h - depth * 0.5)
      ..quadraticBezierTo(w * 0.75, h - depth * 1.2, w, h - depth * 0.6);
    // Step 3: go up the right side and close the shape at the top.
    path
      ..lineTo(w, 0)
      ..close();
    return path;
  }

  @override
  bool shouldReclip(covariant WaveEdgeClipper oldClipper) => oldClipper.depth != depth;
}
