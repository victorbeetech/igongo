// Welcome screen 3 of 3: built for the whole community. Get Started goes to
// sign-in; Explore as a Guest opens the guest home; Sign In goes to sign-in.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import 'widgets/info_card.dart';
import 'widgets/onboarding_actions.dart';
import 'widgets/onboarding_badge.dart';
import 'widgets/onboarding_dots.dart';
import 'widgets/onboarding_eyebrow.dart';
import 'widgets/onboarding_hero.dart';
import 'widgets/onboarding_pill.dart';
import 'widgets/onboarding_top_bar.dart';

/// The last onboarding screen. [onNext] (Get Started) and [onSignIn] go to
/// sign-in; [onExplore] opens the guest home; [onSkip] leaves for sign-in.
class WelcomeStepThree extends StatelessWidget {
  /// Creates screen 3 with its actions.
  const WelcomeStepThree({
    super.key,
    required this.onNext,
    required this.onSignIn,
    required this.onSkip,
    required this.onExplore,
  });

  /// Get Started: goes to sign-in, which ends the welcome.
  final VoidCallback onNext;

  /// The Sign In link: goes to sign-in.
  final VoidCallback onSignIn;

  /// Skip: leaves the welcome for sign-in.
  final VoidCallback onSkip;

  /// Explore as a Guest: opens the guest home.
  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: scrolls when the text is large, so nothing is cut off.
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.md, IgongoSpace.xl, IgongoSpace.xl),
      child: Column(
        children: [
          // Step 2: the language label on the left (English is the only language so far), Skip on the right.
          OnboardingTopBar(leading: const OnboardingPill(label: 'English', icon: Icons.language), onSkip: onSkip),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the hero photo, with the community place tag and the connected badge.
          const OnboardingHero(
            placeTag: 'Igongo Community Hub',
            placeIcon: Icons.place,
            badge: OnboardingBadge(icon: Icons.handshake, title: 'Connected for Guests & Staff'),
            emblem: false,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the eyebrow, the title and the description.
          const OnboardingEyebrow(text: 'Culture & Stay', flanked: false),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'Built for Our Entire Community',
            textAlign: TextAlign.center,
            style: context.text.displaySmall?.copyWith(color: p.text),
          ),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'Guests access seamless concierge and cultural itineraries, '
            'while team members clock in, fulfill room orders, and coordinate daily tasks in unison.',
            textAlign: TextAlign.center,
            style: context.text.bodyLarge?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the two highlight cards, one for guests and one for staff.
          const OnboardingInfoCard(
            icon: Icons.room_service,
            eyebrow: '24/7 Care',
            title: 'For Guests',
            body: 'Order regional delicacies, book museum tours, & unlock villa amenities.',
          ),
          const SizedBox(height: IgongoSpace.sm),
          const OnboardingInfoCard(
            icon: Icons.badge,
            eyebrow: 'Operations',
            title: 'For Staff & Guides',
            body: 'One-tap duty clock-in, live shift rosters, & immediate task coordination.',
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the page dots, screen 3 showing.
          const OnboardingDots(count: 3, index: 2),
          const SizedBox(height: IgongoSpace.lg),
          // Step 7: Get Started and Explore as a Guest.
          OnboardingActions(
            primaryLabel: 'Get Started',
            primaryIcon: Icons.arrow_forward,
            onPrimary: onNext,
            secondaryLabel: 'Explore as a Guest',
            secondaryIcon: Icons.explore,
            onSecondary: onExplore,
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 8: the sign-in link for people who already have an account.
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text('Already have an account? ', style: context.text.bodyLarge?.copyWith(color: p.textMuted)),
              IgongoButton(label: 'Sign In', variant: ButtonVariant.text, onPressed: onSignIn),
            ],
          ),
        ],
      ),
    );
  }
}
