// The top of every Auth screen, as in the approved design: the hut photo clear
// at the top, a red gradient rising from its bottom edge, a white curve along
// the bottom, and the Igongo logo on a white badge that sits on that curve.
// Shared so Sign in, Forgot password, Check email and Create account all look the same.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import '../logo/igongo_logo.dart';
import '../wave/wave_edge_clipper.dart';
import 'auth_assets.dart';

/// The photo, gradient, white curve and logo badge at the top of an Auth screen.
class AuthHero extends StatelessWidget {
  /// Creates the hero. [height] is the photo's height in logical pixels.
  const AuthHero({super.key, this.height = 224});

  /// The photo's height in logical pixels.
  final double height;

  /// How tall the red gradient is, counted up from the bottom edge. It fades out above this, so the photo stays clear at the top.
  static const _gradientHeight = 112.0;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Step 1: the photo fills the box, cropped to the middle so the hut stays clear and in view.
          Image.asset(authHutPhoto, fit: BoxFit.cover, semanticLabel: 'Igongo hotel hut'),
          // Step 2: the red gradient rises from the bottom edge and fades out before the top of the photo.
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
          // Step 3: a white curve along the bottom edge, so the white sheet rises out of the photo.
          Align(
            alignment: Alignment.bottomCenter,
            child: ClipPath(
              clipper: const WaveEdgeClipper(depth: 14),
              child: Container(height: 26, color: palette.surface),
            ),
          ),
          // Step 4: the horizontal logo on a white badge, sitting on the curve at the bottom, as in the design.
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
