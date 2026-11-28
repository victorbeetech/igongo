// The special weekend offer from the past days: the discount, the code and a View Offer button.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_card_frame.dart';
import 'updates_pill_button.dart';

/// The weekend offer card. Its content is placeholder until the promotions feed is wired.
class WeekendOfferUpdateCard extends StatelessWidget {
  /// Creates the card.
  const WeekendOfferUpdateCard({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return UpdatesCardFrame(
      icon: Icons.card_giftcard,
      iconBackground: p.accent.withValues(alpha: 0.2),
      iconColor: p.text,
      title: 'Special Weekend Offer',
      time: '2 days ago',
      muted: true,
      body: Text.rich(
        TextSpan(
          style: text.bodyMedium?.copyWith(color: p.textMuted),
          children: [
            const TextSpan(text: 'Enjoy '),
            TextSpan(
              text: '20% off',
              style: TextStyle(color: p.primary, fontWeight: FontWeight.w700),
            ),
            const TextSpan(
              text: ' luxury private cottage stays this weekend including complimentary traditional buffet breakfast and guided museum passes.',
            ),
          ],
        ),
      ),
      // The promo code on the left, the View Offer button on the right.
      details: Row(
        children: [
          Expanded(
            child: Text(
              'CODE: IGONGO20',
              style: text.labelSmall?.copyWith(color: p.primaryText, fontWeight: FontWeight.w700, letterSpacing: 0.6),
            ),
          ),
          UpdatesPillButton(
            label: 'View Offer',
            trailing: Icons.arrow_forward,
            background: p.accent,
            foreground: p.text,
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}
