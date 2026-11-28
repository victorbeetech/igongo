// The faint decoration on the Me banner: a grid of dots and the Ankole horns
// watermark on the right. Both are drawn in one colour, so the theme sets it.

import 'package:material_ui/material_ui.dart';

/// Paints the dot grid and the horns over the banner photo.
class ProfileBannerPattern extends CustomPainter {
  /// Creates the painter; [ink] is the colour of the dots and horns.
  const ProfileBannerPattern({required this.ink});

  /// The dot and horn colour (white in both modes).
  final Color ink;

  /// Distance between dots, in logical pixels.
  static const _step = 24.0;

  /// The horns outline, drawn in a 100 by 100 box.
  static final Path _horns = Path()
    ..moveTo(10, 80)
    ..quadraticBezierTo(25, 15, 50, 18)
    ..quadraticBezierTo(75, 15, 90, 80)
    ..quadraticBezierTo(75, 42, 50, 48)
    ..quadraticBezierTo(25, 42, 10, 80)
    ..close();

  @override
  void paint(Canvas canvas, Size size) {
    // Step 1: two grids of dots, the second one offset and fainter.
    final dots = Paint()..color = ink.withValues(alpha: 0.08);
    final offsetDots = Paint()..color = ink.withValues(alpha: 0.04);
    for (var y = 0.0; y < size.height; y += _step) {
      for (var x = 0.0; x < size.width; x += _step) {
        canvas.drawCircle(Offset(x, y), 1.5, dots);
        canvas.drawCircle(Offset(x + _step / 2, y + _step / 2), 1.5, offsetDots);
      }
    }
    // Step 2: the horns, 224 wide, 25 pixels from the top, running off the right edge.
    const boxWidth = 224.0;
    final scale = (boxWidth < size.height ? boxWidth : size.height) / 100;
    final left = size.width + 20 - boxWidth;
    final dx = left + (boxWidth - 100 * scale) / 2;
    final dy = 25 + (size.height - 100 * scale) / 2;
    canvas.save();
    canvas.translate(dx, dy);
    canvas.scale(scale);
    canvas.drawPath(_horns, Paint()..color = ink.withValues(alpha: 0.07));
    canvas.restore();
  }

  @override
  bool shouldRepaint(ProfileBannerPattern oldDelegate) => oldDelegate.ink != ink;
}
