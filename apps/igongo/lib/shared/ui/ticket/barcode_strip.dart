// The decorative barcode strip under a ticket's QR code, drawn in the light
// panel colours so it reads the same in light and dark mode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import 'barcode_bars.dart';

/// Draws the bars of [code] across the width it is given.
class BarcodeStrip extends StatelessWidget {
  /// Creates the strip for [code], [height] tall.
  const BarcodeStrip({super.key, required this.code, this.height = IgongoSpace.xxl});

  /// The code the bars are made from.
  final String code;

  /// The strip's height.
  final double height;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: height,
    width: double.infinity,
    child: CustomPaint(painter: _BarsPainter(barcodeBars(code))),
  );
}

/// Paints each bar as a black column; gaps stay empty.
class _BarsPainter extends CustomPainter {
  _BarsPainter(this.bars);

  /// True for a bar, false for a gap, left to right.
  final List<bool> bars;

  @override
  void paint(Canvas canvas, Size size) {
    if (bars.isEmpty) return;
    final paint = Paint()..color = IgongoColorsLight.brandInk;
    // Step 1: each column is an equal share of the width.
    final column = size.width / bars.length;
    // Step 2: fill the columns that are bars.
    for (var i = 0; i < bars.length; i++) {
      if (!bars[i]) continue;
      canvas.drawRect(Rect.fromLTWH(i * column, 0, column, size.height), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _BarsPainter old) => old.bars != bars;
}
