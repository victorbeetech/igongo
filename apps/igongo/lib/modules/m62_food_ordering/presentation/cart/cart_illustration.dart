// The empty-cart illustration: the design's cart artwork, with a fallback
// trolley drawn in code if the image is missing. It is decorative only.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The empty-cart drawing, 200 wide and 150 tall.
class CartIllustration extends StatelessWidget {
  /// Creates the drawing.
  const CartIllustration({super.key});

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    // Step 1: the design's cart artwork. If it cannot load, the drawn trolley below shows instead.
    child: Image.asset(
      'assets/cart/cart-illustration.png',
      width: 200,
      height: 150,
      fit: BoxFit.contain,
      errorBuilder: (context, error, stack) =>
          CustomPaint(size: const Size(200, 150), painter: _CartPainter(context.palette)),
    ),
  );
}

/// Paints the trolley. All positions are fractions of the box, so it scales.
class _CartPainter extends CustomPainter {
  /// Creates the painter with the theme colours.
  const _CartPainter(this.palette);

  /// The theme's colours (red, cream and the soft disc).
  final IgongoPalette palette;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    // Step 1: the soft disc behind the cart.
    canvas.drawCircle(Offset(w * 0.5, h * 0.5), h * 0.46, Paint()..color = palette.primaryContainer);
    // Step 2: the cream parcel sitting in the basket.
    canvas.drawRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(w * 0.36, h * 0.28, w * 0.26, h * 0.2), const Radius.circular(4)),
      Paint()..color = palette.surfaceAlt,
    );
    // Step 3: the basket, a red trapezoid open at the top.
    final basket = Path()
      ..moveTo(w * 0.3, h * 0.42)
      ..lineTo(w * 0.8, h * 0.42)
      ..lineTo(w * 0.72, h * 0.66)
      ..lineTo(w * 0.36, h * 0.66)
      ..close();
    canvas.drawPath(basket, Paint()..color = palette.primary);
    // Step 4: the handle and the frame that runs to the wheels.
    final frame = Paint()
      ..color = palette.primary
      ..strokeWidth = 5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(
      Path()
        ..moveTo(w * 0.12, h * 0.26)
        ..lineTo(w * 0.24, h * 0.26)
        ..lineTo(w * 0.36, h * 0.66)
        ..lineTo(w * 0.72, h * 0.66),
      frame,
    );
    // Step 5: the two wheels under the basket.
    final wheel = Paint()..color = palette.primary;
    canvas.drawCircle(Offset(w * 0.41, h * 0.82), 6, wheel);
    canvas.drawCircle(Offset(w * 0.68, h * 0.82), 6, wheel);
    // Step 6: three short motion marks above the right corner, so the cart looks like it is moving.
    final marks = Paint()
      ..color = palette.primary
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;
    for (var i = 0; i < 3; i++) {
      final y = h * (0.12 + i * 0.08);
      canvas.drawLine(Offset(w * 0.82, y), Offset(w * 0.9, y - 6), marks);
    }
  }

  @override
  bool shouldRepaint(covariant _CartPainter old) => old.palette != palette;
}
