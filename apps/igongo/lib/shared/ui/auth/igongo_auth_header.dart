// The header at the top of every Auth screen, to match the Stitch reference:
// the hotel photo behind the status bar, a red gradient rising from the bottom,
// a smooth white curve, and the Igongo logo on a floating white card that
// overlaps the photo and the curve. Shared by Sign in and Create account.

import 'package:flutter/services.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../logo/igongo_logo.dart';
import 'auth_assets.dart';
import 'auth_curve_clipper.dart';

/// The Auth header: photo, red gradient, curved white section and floating logo card.
class IgongoAuthHeader extends StatelessWidget {
  /// Creates the header. [height] is the visible height below the status bar; when left out it scales with the phone's height.
  const IgongoAuthHeader({super.key, this.height});

  /// The visible height below the status bar, or null to scale with the phone.
  final double? height;

  @override
  Widget build(BuildContext context) {
    // Step 1: the palette, for the brand red and the white surface.
    final palette = context.palette;
    // Step 2: the space the status bar takes. The photo runs behind it.
    final topInset = MediaQuery.paddingOf(context).top;
    // Step 3: a responsive height: about 28% of the phone's height, kept between 190 and 260 logical pixels.
    final visible = height ?? (MediaQuery.sizeOf(context).height * 0.28).clamp(190.0, 260.0);
    final total = visible + topInset;
    // Step 4: the logo grows a little with the header, between 36 and 52 pixels tall.
    final logoHeight = (visible * 0.18).clamp(36.0, 52.0);

    return SizedBox(
      height: total,
      width: double.infinity,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Layer 1: the hotel photo, covering the whole header, behind the status bar.
          Positioned.fill(child: Image.asset(authHutPhoto, fit: BoxFit.cover, alignment: Alignment.center)),
          // Layer 2: the red gradient, clear at the top and reaching the brand red at the bottom.
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0.35, 0.65, 1.0],
                  colors: [
                    palette.primary.withValues(alpha: 0),
                    palette.primary.withValues(alpha: 0.4),
                    palette.primary.withValues(alpha: 0.8),
                  ],
                ),
              ),
            ),
          ),
          // Layer 3: the white section, cut by the curve, so it overlaps the bottom of the photo.
          Positioned.fill(
            child: ClipPath(
              clipper: const IgongoCurveClipper(),
              child: ColoredBox(color: palette.surface),
            ),
          ),
          // Layer 4: the logo on a floating white card, centred horizontally on the curve.
          Positioned(
            top: total * 0.68,
            left: 0,
            right: 0,
            child: Center(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: palette.surface,
                  borderRadius: BorderRadius.circular(IgongoRadius.lg),
                  boxShadow: [
                    BoxShadow(color: palette.text.withValues(alpha: 0.12), blurRadius: 18, offset: const Offset(0, 5)),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
                  child: IgongoLogo(shape: LogoShape.horizontal, height: logoHeight),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// The status bar style for Auth screens: light icons over the dark photo.
  static const statusBarStyle = SystemUiOverlayStyle.light;
}
