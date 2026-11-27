// Welcome screen 1 of 3: the hero photo, what Igongo offers, and two choices:
// Get started (next screen) or Explore as a guest (the guest home).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'widgets/feature_chip.dart';
import 'widgets/onboarding_actions.dart';
import 'widgets/onboarding_dots.dart';
import 'widgets/onboarding_eyebrow.dart';
import 'widgets/onboarding_footer.dart';
import 'widgets/onboarding_hero.dart';
import 'widgets/onboarding_pill.dart';
import 'widgets/onboarding_top_bar.dart';

/// The first onboarding screen. [onNext] shows screen 2; [onSkip] and [onExplore] leave the welcome.
class WelcomeStepOne extends StatelessWidget {
  /// Creates screen 1 with its three actions.
  const WelcomeStepOne({super.key, required this.onNext, required this.onSkip, required this.onExplore});

  /// Get started: shows screen 2.
  final VoidCallback onNext;

  /// Skip: leaves the welcome for sign-in.
  final VoidCallback onSkip;

  /// Explore as a guest: opens the guest home.
  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: the page scrolls on small or large-text phones, so nothing is cut off.
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.md, IgongoSpace.xl, IgongoSpace.xl),
      child: Column(
        children: [
          // Step 2: the label on the left and Skip on the right.
          OnboardingTopBar(leading: const OnboardingPill(label: 'Welcome'), onSkip: onSkip),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the hero photo, with the place tag and the emblem on the wave.
          const OnboardingHero(placeTag: 'Western Uganda', placeIcon: Icons.local_activity),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the eyebrow, the title and the subtitle, centred.
          const OnboardingEyebrow(text: 'Discover Ankole Heritage'),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'Welcome to Igongo',
            textAlign: TextAlign.center,
            style: context.text.displaySmall?.copyWith(color: p.text),
          ),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'One app for the country hotel, the museum, authentic dining, events, and tranquil hill country escapes.',
            textAlign: TextAlign.center,
            style: context.text.bodyLarge?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the three things the hotel offers, as chips that wrap onto new lines if needed.
          const Wrap(
            alignment: WrapAlignment.center,
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              FeatureChip(icon: Icons.bed, label: '5-Star Cottages'),
              FeatureChip(icon: Icons.museum, label: 'Cultural Museum'),
              FeatureChip(icon: Icons.pool, label: 'Dining & Pool'),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the page dots, screen 1 showing.
          const OnboardingDots(count: 3, index: 0),
          const SizedBox(height: IgongoSpace.lg),
          // Step 7: the two choices.
          OnboardingActions(
            primaryLabel: 'Get started',
            primaryIcon: Icons.arrow_forward,
            onPrimary: onNext,
            secondaryLabel: 'Explore as a guest',
            secondaryIcon: Icons.explore,
            onSecondary: onExplore,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 8: the footer line naming the places.
          const OnboardingFooter(text: 'Eriijukiro Museum • Biharwe Eclipse • Mbarara'),
        ],
      ),
    );
  }
}
