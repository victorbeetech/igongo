// The hero photo of an onboarding screen: a photo with a wavy bottom edge,
// with optional tags and badges in its corners. The first screen can also
// show the Igongo emblem sitting on the wave. Until the hotel's photo is set,
// the shared placeholder shows.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/logo/igongo_logo.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';
import '../../../../../shared/ui/wave/wave_edge_clipper.dart';

/// The hero photo with its corner items and, optionally, the emblem on the wave.
class OnboardingHero extends StatelessWidget {
  /// Creates the hero. [height] is the screen's own size; the corner items are optional.
  const OnboardingHero({
    super.key,
    required this.height,
    this.label = 'Hotel photo',
    this.topLeft,
    this.bottomLeft,
    this.bottomRight,
    this.emblemOnWave = false,
  });

  /// The hero's height, set per screen to match its design.
  final double height;

  /// What the photo shows, read by screen readers.
  final String label;

  /// An item in the top left corner, such as a tag or the logo chip.
  final Widget? topLeft;

  /// An item in the bottom left corner, above the wave.
  final Widget? bottomLeft;

  /// An item in the bottom right corner, above the wave.
  final Widget? bottomRight;

  /// Whether the Igongo logo card sits centred across the wave.
  final bool emblemOnWave;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the photo area, cut along a wave at the bottom so the page shows through below it.
    return SizedBox(
      height: height,
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipPath(
              clipper: const WaveEdgeClipper(depth: 24),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Step 2: the photo, or the shared placeholder until the hotel supplies one.
                  GuestPhoto(label: label),
                  // Step 3: a red scrim from the bottom, so the white words read on the photo.
                  DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [p.primary.withValues(alpha: 0.85), p.primary.withValues(alpha: 0)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Step 4: the corner items, each in its own corner of the photo.
          if (topLeft != null) Positioned(top: IgongoSpace.md, left: IgongoSpace.md, child: topLeft!),
          if (bottomLeft != null) Positioned(left: IgongoSpace.md, bottom: IgongoSpace.xl, child: bottomLeft!),
          if (bottomRight != null) Positioned(right: IgongoSpace.md, bottom: IgongoSpace.xl, child: bottomRight!),
          // Step 5: the emblem card, centred across the wave, for the first screen.
          if (emblemOnWave)
            const Positioned(left: 0, right: 0, bottom: 0, child: Center(child: _EmblemCard())),
        ],
      ),
    );
  }
}

/// The white card holding the Igongo logo, shown across the wave.
class _EmblemCard extends StatelessWidget {
  /// Creates the emblem card.
  const _EmblemCard();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: a raised white card with rounded corners.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.md),
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        boxShadow: [BoxShadow(color: p.text.withValues(alpha: 0.12), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      // Step 2: the horizontal logo, drawn from the brand kit, never redrawn.
      child: const IgongoLogo(shape: LogoShape.horizontal, height: 36),
    );
  }
}
