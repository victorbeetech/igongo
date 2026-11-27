// The hero photo of an onboarding screen: a photo with a wavy bottom edge, a
// place tag at the top, an optional badge, and the Igongo emblem sitting on
// the wave. Until the hotel's photo is set, the shared placeholder shows.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/logo/igongo_logo.dart';
import '../../../../../shared/ui/photo/guest_photo.dart';
import '../../../../../shared/ui/wave/wave_edge_clipper.dart';
import 'onboarding_pill.dart';

/// The height of the hero, the same on every onboarding screen so the buttons sit in one place.
const _heroHeight = 260.0;

/// The hero photo, with its place tag, badge and emblem.
class OnboardingHero extends StatelessWidget {
  /// Creates the hero. [placeTag] names the place; [badge] is an optional
  /// card on the lower left; [emblem] shows the Igongo logo on the wave.
  const OnboardingHero({
    super.key,
    required this.placeTag,
    this.placeIcon,
    this.badge,
    this.emblem = true,
  });

  /// The name of the place, shown as a tag at the top left.
  final String placeTag;

  /// An optional icon for the place tag.
  final IconData? placeIcon;

  /// An optional badge on the lower left, above the wave.
  final Widget? badge;

  /// Whether the Igongo emblem sits on the wave.
  final bool emblem;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the photo area, cut along a wave at the bottom so the page shows through below it.
    return SizedBox(
      height: _heroHeight,
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipPath(
              clipper: const WaveEdgeClipper(depth: 24),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Step 2: the photo, or the shared placeholder until the hotel supplies one.
                  GuestPhoto(label: placeTag),
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
          // Step 4: the place tag at the top left.
          Positioned(
            top: IgongoSpace.md,
            left: IgongoSpace.md,
            child: OnboardingPill(label: placeTag, icon: placeIcon, onDark: true),
          ),
          // Step 5: the badge, if this screen has one, above the wave on the left.
          if (badge != null)
            Positioned(left: IgongoSpace.md, bottom: IgongoSpace.xl, child: badge!),
          // Step 6: the emblem card, centred across the wave.
          if (emblem)
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: Center(child: _EmblemCard()),
            ),
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
