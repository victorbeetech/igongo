// Welcome screen 2 of 3: book, dine and order. Back returns to screen 1;
// Get started shows screen 3; Explore as a guest opens the guest home.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'widgets/info_card.dart';
import 'widgets/onboarding_actions.dart';
import 'widgets/onboarding_badge.dart';
import 'widgets/onboarding_dots.dart';
import 'widgets/onboarding_eyebrow.dart';
import 'widgets/onboarding_footer.dart';
import 'widgets/onboarding_hero.dart';
import 'widgets/onboarding_pill.dart';
import 'widgets/onboarding_top_bar.dart';

/// The second onboarding screen. [onBack] shows screen 1, [onNext] shows screen 3,
/// and [onSkip] and [onExplore] leave the welcome.
class WelcomeStepTwo extends StatelessWidget {
  /// Creates screen 2 with its actions.
  const WelcomeStepTwo({
    super.key,
    required this.onBack,
    required this.onNext,
    required this.onSkip,
    required this.onExplore,
  });

  /// Back: shows screen 1.
  final VoidCallback onBack;

  /// Get started: shows screen 3.
  final VoidCallback onNext;

  /// Skip: leaves the welcome for sign-in.
  final VoidCallback onSkip;

  /// Explore as a guest: opens the guest home.
  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: scrolls when the text is large, so nothing is cut off.
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.xl, IgongoSpace.md, IgongoSpace.xl, IgongoSpace.xl),
      child: Column(
        children: [
          // Step 2: Back and the step counter on the left, Skip on the right.
          OnboardingTopBar(
            leading: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: IgongoSpace.xs,
              children: [
                IconButton(icon: const Icon(Icons.arrow_back), tooltip: 'Back', onPressed: onBack),
                const OnboardingPill(label: 'Step 2 of 3'),
              ],
            ),
            onSkip: onSkip,
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the hero photo, with the restaurant tag and the Instant MoMo badge.
          const OnboardingHero(
            placeTag: 'Veranda Dining',
            placeIcon: Icons.restaurant_menu,
            badge: OnboardingBadge(icon: Icons.contactless, title: 'Instant MoMo', subtitle: 'MTN & Airtel'),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the eyebrow, the title and the description.
          const OnboardingEyebrow(text: 'Seamless Hospitality', flanked: false),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'Book, Dine & Order',
            textAlign: TextAlign.center,
            style: context.text.displaySmall?.copyWith(color: p.text),
          ),
          const SizedBox(height: IgongoSpace.sm),
          Text(
            'Reserve handcrafted luxury cottages, book Eclipse tours, enjoy lakeside veranda dining, '
            'and checkout instantly with MTN & Airtel Mobile Money.',
            textAlign: TextAlign.center,
            style: context.text.bodyLarge?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the two value cards, then the room service row with its opening hours.
          const OnboardingInfoCard(
            icon: Icons.cabin,
            title: 'Suites & Tours',
            body: 'Instant confirmation & museum access',
          ),
          const SizedBox(height: IgongoSpace.sm),
          const OnboardingInfoCard(
            icon: Icons.payments,
            title: 'Cashless Ease',
            body: 'Zero-fee Mobile Money & cards',
          ),
          const SizedBox(height: IgongoSpace.sm),
          OnboardingInfoCard(
            icon: Icons.room_service,
            title: 'Garden Room Service',
            body: 'Order hot Ankole dishes straight to your cottage patio.',
            trailing: Text('7am - 11pm', style: context.text.labelLarge?.copyWith(color: p.primaryText)),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the page dots, screen 2 showing.
          const OnboardingDots(count: 3, index: 1),
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
          // Step 8: the footer line naming the hotel.
          const OnboardingFooter(text: 'Igongo Country Hotel • Mbarara, Western Uganda'),
        ],
      ),
    );
  }
}
