// The top of every Auth screen, as in the approved design: the hut photo clear
// at the top, a red gradient rising from its bottom edge, and the photo's own
// bottom edge curving into the white sheet. The Igongo logo sits on a white
// badge on that curve. Shared so Sign in, Forgot password, Check email and
// Create account all look the same.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import '../logo/igongo_logo.dart';
import '../wave/wave_edge_clipper.dart';
import 'auth_assets.dart';

/// The photo, gradient, curved bottom edge and logo badge at the top of an Auth screen.
class AuthHero extends StatelessWidget {
  /// Creates the hero. [height] is the hero's height in logical pixels.
  const AuthHero({super.key, this.height = 224});

  /// The hero's height in logical pixels.
  final double height;

  /// How tall the red gradient is, counted up from the bottom edge. It fades out above this, so the photo stays clear at the top.
  static const _gradientHeight = 112.0;

  /// How far the curve dips at the bottom of the photo, in logical pixels.
  static const _curveDepth = 22.0;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Step 1: the white sheet colour sits behind everything, so the area under the curve is white, as in the design.
          ColoredBox(color: palette.surface),
          // Step 2: the photo and its gradient, cut along a curved bottom edge so the white shows through below it.
          ClipPath(
            clipper: const WaveEdgeClipper(depth: _curveDepth),
            child: Stack(
              fit: StackFit.expand,
              children: [
                // Step 2a: the photo fills the box, cropped to the middle so the hut stays clear and in view.
                Image.asset(authHutPhoto, fit: BoxFit.cover, semanticLabel: 'Igongo hotel hut'),
                // Step 2b: the red gradient rises from the bottom edge and fades out before the top of the photo.
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Container(
                    height: _gradientHeight,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [palette.primaryDark.withValues(alpha: 0.9), palette.primary.withValues(alpha: 0)],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Step 3: the logo on a white badge, sitting on the curve at the bottom, as in the design.
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: palette.surface,
                  borderRadius: BorderRadius.circular(IgongoRadius.lg),
                  boxShadow: [
                    BoxShadow(color: palette.text.withValues(alpha: 0.15), blurRadius: 12, offset: const Offset(0, 4)),
                  ],
                ),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
                  child: IgongoLogo(shape: LogoShape.horizontal, height: 40),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
