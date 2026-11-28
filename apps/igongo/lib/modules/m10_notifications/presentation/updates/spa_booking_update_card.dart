// The spa booking update: the confirmed time, with a prompt box and a Directions button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_card_frame.dart';
import 'updates_pill_button.dart';

/// The spa booking card. Its content is placeholder until the booking feed is wired.
class SpaBookingUpdateCard extends StatelessWidget {
  /// Creates the card. [unread] shows the red dot.
  const SpaBookingUpdateCard({super.key, required this.unread});

  /// Whether the card is still unread.
  final bool unread;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return UpdatesCardFrame(
      icon: Icons.spa,
      iconBackground: p.primaryContainer,
      iconColor: p.primary,
      title: 'Spa Booking Confirmed',
      time: '2 hours ago',
      unread: unread,
      body: Text.rich(
        TextSpan(
          style: text.bodyMedium?.copyWith(color: p.textMuted),
          children: [
            const TextSpan(text: 'Your '),
            TextSpan(
              text: 'Ankole Herbal Rejuvenation Massage',
              style: TextStyle(color: p.text, fontWeight: FontWeight.w600),
            ),
            const TextSpan(text: ' is confirmed for today at '),
            TextSpan(
              text: '4:30 PM',
              style: TextStyle(color: p.primaryText, fontWeight: FontWeight.w700),
            ),
            const TextSpan(text: ' at the Wellness Sanctuary Pavilion.'),
          ],
        ),
      ),
      // The prompt box in the text column: the time, the therapist and the Directions button.
      details: Container(
        padding: const EdgeInsets.all(IgongoSpace.md),
        decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
        child: Row(
          children: [
            Icon(Icons.schedule, size: 16, color: p.primaryText),
            const SizedBox(width: IgongoSpace.sm),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Today • 4:30 PM (60 min)',
                    style: text.labelMedium?.copyWith(color: p.text, fontWeight: FontWeight.w600),
                  ),
                  Text('Therapist: Christine K.', style: text.labelSmall?.copyWith(color: p.textMuted)),
                ],
              ),
            ),
            // The Directions button; wired to the map when the booking feed is connected.
            UpdatesPillButton(label: 'Directions', background: p.primary, foreground: p.onPrimary, onPressed: () {}),
          ],
        ),
      ),
    );
  }
}
