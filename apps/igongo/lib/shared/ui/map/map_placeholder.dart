// A drawn site map with pins, standing in for Google Maps until Phase 8.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A sample map of the Igongo grounds with a few pins.
class MapPlaceholder extends StatelessWidget {
  /// Creates the sample map.
  const MapPlaceholder({super.key, this.height = 220});

  /// The map height.
  final double height;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return ClipRRect(
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: SizedBox(
        height: height,
        child: Stack(
          children: [
            // Step 1: the ground and roads, painted from the palette.
            Positioned.fill(
              child: CustomPaint(
                painter: _GroundsPainter(ground: p.surfaceAlt, road: p.border),
              ),
            ),
            // Step 2: pins for a few places, in brand red.
            for (final (x, y, label) in const [
              (0.25, 0.3, 'Main building'),
              (0.62, 0.45, 'Museum'),
              (0.4, 0.72, 'Pool'),
            ])
              Align(
                alignment: Alignment(x * 2 - 1, y * 2 - 1),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.location_on, color: p.primary, size: 28),
                    Text(label, style: context.text.labelSmall?.copyWith(fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

// Paints a plain ground with two crossing roads.
class _GroundsPainter extends CustomPainter {
  _GroundsPainter({required this.ground, required this.road});

  final Color ground;
  final Color road;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = ground);
    final roadPaint = Paint()
      ..color = road
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke;
    canvas.drawLine(Offset(0, size.height * 0.55), Offset(size.width, size.height * 0.4), roadPaint);
    canvas.drawLine(Offset(size.width * 0.5, 0), Offset(size.width * 0.45, size.height), roadPaint);
  }

  @override
  bool shouldRepaint(_GroundsPainter old) => old.ground != ground || old.road != road;
}
