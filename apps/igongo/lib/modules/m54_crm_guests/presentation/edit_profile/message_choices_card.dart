// The "Messages I agree to get" group: SMS, WhatsApp concierge and email news.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';
import 'message_choice_row.dart';

/// The three message switches.
class MessageChoicesCard extends StatelessWidget {
  /// Creates the card from the three current values and their change handlers.
  const MessageChoicesCard({
    super.key,
    required this.sms,
    required this.whatsapp,
    required this.email,
    required this.onSms,
    required this.onWhatsapp,
    required this.onEmail,
  });

  /// Whether SMS messages are agreed to.
  final bool sms;

  /// Whether WhatsApp messages are agreed to.
  final bool whatsapp;

  /// Whether email news and receipts are agreed to.
  final bool email;

  /// Called when the SMS choice changes.
  final ValueChanged<bool> onSms;

  /// Called when the WhatsApp choice changes.
  final ValueChanged<bool> onWhatsapp;

  /// Called when the email choice changes.
  final ValueChanged<bool> onEmail;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.sm,
        children: [
          Text(
            'MESSAGES I AGREE TO GET',
            style: context.text.labelSmall?.copyWith(color: p.textMuted, letterSpacing: 1.6, fontWeight: FontWeight.w700),
          ),
          MessageChoiceRow(
            icon: Icons.sms_outlined,
            title: 'SMS Notifications',
            subtitle: 'Instant reservation codes',
            value: sms,
            onChanged: onSms,
          ),
          MessageChoiceRow(
            icon: Icons.chat_outlined,
            title: 'WhatsApp Concierge',
            subtitle: 'Direct butler & tour chat',
            value: whatsapp,
            onChanged: onWhatsapp,
            iconFill: p.accent.withValues(alpha: 0.25),
          ),
          MessageChoiceRow(
            icon: Icons.mail_outline,
            title: 'Email News & Receipts',
            subtitle: 'Monthly Ankole heritage digest',
            value: email,
            onChanged: onEmail,
          ),
        ],
      ),
    );
  }
}
