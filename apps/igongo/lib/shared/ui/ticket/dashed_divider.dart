// A dashed line, the tear line of a ticket. Colours and sizes come from the
// tokens, so it follows light and dark mode.

import 'dart:math' as math;

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A horizontal dashed line across the width it is given.
class DashedDivider extends StatelessWidget {
  /// Creates the line. [color] defaults to the theme's border colour.
  const DashedDivider({super.key, this.color});

  /// The line's colour, or null for the border colour.
  final Color? color;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: IgongoSpace.xxs,
    width: double.infinity,
    child: CustomPaint(painter: _DashPainter(color ?? context.palette.border)),
  );
}

/// Paints the dashes: a dash, a gap, and so on along the middle of the box.
class _DashPainter extends CustomPainter {
  _DashPainter(this.color);

  /// The dash colour.
  final Color color;

  // Step 1: the dash and gap lengths and the stroke, all from the spacing tokens.
  static const _dash = IgongoSpace.sm;
  static const _gap = IgongoSpace.xs;
  static const _stroke = IgongoSpace.xxs;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = _stroke;
    final y = size.height / 2;
    // Step 2: draw one dash at a time until the line runs out.
    for (var x = 0.0; x < size.width; x += _dash + _gap) {
      canvas.drawLine(Offset(x, y), Offset(math.min(x + _dash, size.width), y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _DashPainter old) => old.color != color;
}
