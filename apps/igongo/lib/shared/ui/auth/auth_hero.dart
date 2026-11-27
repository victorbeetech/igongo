// The top of every Auth screen: the hut photo, a red gradient rising from its
// bottom edge, the Igongo logo on it, and a red wave along the bottom edge.
// Shared so Sign in, Forgot password, Check email and Create account all look the same.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import '../logo/igongo_logo.dart';
import '../wave/wave_edge_clipper.dart';
import 'auth_assets.dart';

/// The photo, gradient, logo and wave banner at the top of an Auth screen.
class AuthHero extends StatelessWidget {
  /// Creates the hero. [height] is the photo's height in logical pixels.
  const AuthHero({super.key, this.height = 200});

  /// The photo's height in logical pixels.
  final double height;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the photo fills the box, cropped to the middle so the hut stays in view.
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(authHutPhoto, fit: BoxFit.cover, semanticLabel: 'Igongo hotel hut'),
          // Step 2: a red gradient that fades in from the bottom edge, so the wave sits on red as in the design.
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: 96,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [palette.primaryDark.withValues(alpha: 0.9), palette.primary.withValues(alpha: 0)],
                ),
              ),
            ),
          ),
          // Step 3: the logo sits at the top centre, in its colour version over the photo.
          const Align(
            alignment: Alignment.topCenter,
            child: Padding(
              padding: EdgeInsets.only(top: IgongoSpace.md),
              child: IgongoLogo(shape: LogoShape.stacked, height: 72),
            ),
          ),
          // Step 4: a red wave along the bottom edge, drawn with the shared wave clip.
          Align(
            alignment: Alignment.bottomCenter,
            child: ClipPath(
              clipper: const WaveEdgeClipper(depth: 14),
              child: Container(height: 26, color: palette.primary),
            ),
          ),
        ],
      ),
    );
  }
}
