// S00-46 Contact Us: three ways to reach the hotel (phone, email, WhatsApp) and
// the location. Opened from the "Contact Us" links on the sign-in and create
// account screens. The numbers and address are placeholders (shared/contact/contact_details.dart).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/contact/contact_details.dart';
import '../../../../shared/contact/contact_launchers.dart';
import '../../../../shared/contact/open_whatsapp_chat.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/contact/contact_channel_card.dart';
import '../../../../shared/ui/contact/location_strip.dart';
import '../../../../shared/ui/whatsapp/whatsapp_icon.dart';

/// The Contact Us screen (S00-46): the channels stacked as cards, then the location.
class ContactUsScreen extends ConsumerWidget {
  /// Creates the screen.
  const ContactUsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: read the theme colours for the page.
    final p = context.palette;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 3: the hotel name and the welcome line above the cards.
          Row(
            children: [
              Expanded(
                child: Text(
                  ContactDetails.hotelName.toUpperCase(),
                  style: context.text.labelSmall?.copyWith(color: p.secondary),
                ),
              ),
              // The call icon from the design's top bar: the same number as the front desk.
              IconButton(
                tooltip: 'Call the front desk',
                icon: Icon(Icons.call, color: p.primary),
                onPressed: () => callNumber(context, ContactDetails.topBarDial),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            'How would you like to reach our front desk and concierge? We are honoured to assist your stay.',
            style: context.text.bodyMedium?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the three channels, one card each, with a small gap between.
          ContactChannelCard(
            glyph: Icon(Icons.phone_in_talk_outlined, color: p.primary, size: 24),
            discColor: p.primaryContainer,
            title: 'Call Front Desk',
            chip: '24/7',
            detail: '${ContactDetails.frontDeskDisplay} • Available 24/7',
            actionLabel: 'Call Now',
            actionIcon: Icons.call,
            actionColor: p.primary,
            actionTextColor: p.onPrimary,
            onAction: () => callNumber(context, ContactDetails.frontDeskDial),
          ),
          const SizedBox(height: IgongoSpace.sm),
          ContactChannelCard(
            glyph: Icon(Icons.mail_outline, color: p.secondary, size: 24),
            discColor: p.accent.withValues(alpha: 0.2),
            title: 'Send an Email',
            chip: '~2h Reply',
            detail: '${ContactDetails.reservationsEmail} • Fast reply within 2 hrs',
            actionLabel: 'Send Email',
            actionIcon: Icons.send_outlined,
            actionColor: p.surfaceAlt,
            actionTextColor: p.text,
            onAction: () => emailReservations(context),
          ),
          const SizedBox(height: IgongoSpace.sm),
          ContactChannelCard(
            glyph: const WhatsappIcon(size: 24),
            discColor: p.success.withValues(alpha: 0.12),
            title: 'Chat on WhatsApp',
            chip: 'Live',
            chipLive: true,
            detail: '${ContactDetails.whatsappDisplay} • Instant chat with Guest Butler',
            actionLabel: 'Open WhatsApp',
            actionIcon: Icons.chat_bubble_outline,
            actionColor: p.success,
            actionTextColor: p.onPrimary,
            // The WhatsApp chat uses the number the super admin set, not the placeholder above.
            onAction: () => openWhatsappChat(context, ref),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the location strip at the foot of the page.
          const LocationStrip(caption: 'Hotel & Cultural Grounds', address: ContactDetails.location),
        ],
      ),
    );
  }
}
