// The header at the top of every Auth screen, copied from the Bookings banner:
// the hotel photo behind the status bar, a red gradient rising from the bottom,
// and a soft wave along the bottom edge. The photo is cut by the wave, so the
// white page shows through below it and blends into the form with no boundary.
// The Igongo logo sits on a floating white card centred on the wave.

import 'package:flutter/services.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../bar/wavy_bottom_clipper.dart';
import '../logo/igongo_logo.dart';
import 'auth_assets.dart';

/// The Auth header: photo, red gradient, wave edge and floating logo card.
class IgongoAuthHeader extends StatelessWidget {
  /// Creates the header. [height] is the visible height below the status bar; when left out it scales with the phone's height.
  const IgongoAuthHeader({super.key, this.height});

  /// The visible height below the status bar, or null to scale with the phone.
  final double? height;

  /// The status bar style for Auth screens: light icons over the dark photo.
  static const statusBarStyle = SystemUiOverlayStyle.light;

  @override
  Widget build(BuildContext context) {
    // Step 1: the palette, for the brand red and the white page.
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
          // Layer 1: the white page colour, so the area under the wave is the same white as the form.
          Positioned.fill(child: ColoredBox(color: palette.surface)),
          // Layers 2 and 3: the photo and its red gradient, cut by the wave along the bottom edge (as the Bookings banner is).
          Positioned.fill(
            child: ClipPath(
              clipper: const WavyBottomClipper(),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Layer 2: the hotel photo, behind the status bar.
                  Image.asset(authHutPhoto, fit: BoxFit.cover, alignment: Alignment.center),
                  // Layer 3: the red gradient, clear at the top and reaching the brand red at the bottom.
                  DecoratedBox(
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
                ],
              ),
            ),
          ),
          // Layer 4: the logo on a floating white card, centred horizontally on the wave.
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
}
