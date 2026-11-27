// The top of every Auth screen: the hut photo, the Igongo logo on it, and a
// red wave along the bottom edge. Shared so Sign in, Forgot password, Check
// email and Create account all look the same.

import 'package:material_ui/material_ui.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../theme/theme.dart';
import '../logo/igongo_logo.dart';
import '../wave/wave_edge_clipper.dart';
import 'auth_assets.dart';

/// The photo, logo and wave banner at the top of an Auth screen.
class AuthHero extends StatelessWidget {
  /// Creates the hero. [height] is the photo's height in logical pixels.
  /// [placeholder] swaps the photo for a neutral box, as the design's hero is until the real photo is chosen.
  const AuthHero({super.key, this.height = 200, this.placeholder = false});

  /// The photo's height in logical pixels.
  final double height;

  /// True to show a neutral placeholder box instead of the hut photo.
  final bool placeholder;

  @override
  Widget build(BuildContext context) {
    // Step 1: the photo fills the box, cropped to the middle so the hut stays in view.
    // A placeholder uses a neutral box in the theme's quiet surface colour instead.
    final picture = placeholder
        ? ColoredBox(
            color: context.palette.surfaceAlt,
            child: Center(child: Icon(Icons.image_outlined, size: 40, color: context.palette.textMuted)),
          )
        : Image.asset(authHutPhoto, fit: BoxFit.cover, semanticLabel: 'Igongo hotel hut');
    return SizedBox(
      height: height,
      child: Stack(
        fit: StackFit.expand,
        children: [
          picture,
          // Step 2: the logo sits at the top centre, in its colour version over the photo.
          const Align(
            alignment: Alignment.topCenter,
            child: Padding(
              padding: EdgeInsets.only(top: IgongoSpace.md),
              child: IgongoLogo(shape: LogoShape.stacked, height: 72),
            ),
          ),
          // Step 3: a red wave along the bottom edge, drawn with the shared wave clip.
          Align(
            alignment: Alignment.bottomCenter,
            child: ClipPath(
              clipper: const WaveEdgeClipper(depth: 14),
              child: Container(height: 26, color: context.palette.primary),
            ),
          ),
        ],
      ),
    );
  }
}
