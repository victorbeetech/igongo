// S00-46 Contact Us: the hotel's front desk (phone), reservations (email),
// WhatsApp and address. Every detail comes from the super admin's Hotel profile
// (see shared/contact/hotel_contact.dart). A channel the super admin has not set
// is left out, and the whole screen can be switched off from the same profile.
// Opened from the "Contact Us" links on the sign-in and create account screens.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/contact/contact_launchers.dart';
import '../../../../shared/contact/hotel_contact.dart';
import '../../../../shared/contact/hotel_contact_provider.dart';
import '../../../../shared/contact/open_whatsapp_chat.dart';
import '../../../../shared/states/state_view.dart';
import '../../../../shared/states/view_state.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/contact/contact_channel_card.dart';
import '../../../../shared/ui/contact/location_strip.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../../../shared/ui/whatsapp/whatsapp_icon.dart';

/// The Contact Us screen (S00-46): loading, error, switched-off and not-set-up states,
/// then the channels the hotel has set, stacked as cards, with the location at the foot.
class ContactUsScreen extends ConsumerWidget {
  /// Creates the screen.
  const ContactUsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: read the hotel's details; the screen shows the matching state until they load.
    final details = ref.watch(hotelContactProvider);
    return details.when(
      // Step 2a: while loading, the brand spiral skeleton.
      loading: () => const StateView(state: ViewState.loading, screenName: 'Contact us'),
      // Step 2b: if they cannot load (offline or the server is down), Try again reloads them.
      error: (_, _) => StateView(
        state: ViewState.error,
        screenName: 'Contact us',
        onRetry: () => ref.invalidate(hotelContactProvider),
      ),
      // Step 2c: the loaded details, or the switched-off notice.
      data: (hotel) => hotel.contactUsOn ? _ContactBody(hotel: hotel) : const _SwitchedOff(),
    );
  }
}

/// The page body once the details are loaded: the channels the hotel has set, then the location.
class _ContactBody extends ConsumerWidget {
  /// Creates the body for [hotel].
  const _ContactBody({required this.hotel});

  /// The hotel's details from the super admin's profile.
  final HotelContact hotel;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the theme colours for the page.
    final p = context.palette;
    // Step 2: a channel is shown only when the super admin has set its detail.
    final hasPhone = hotel.phone.isNotEmpty;
    final hasEmail = hotel.email.isNotEmpty;
    final hasWhatsapp = hotel.whatsapp.isNotEmpty;
    final hasAddress = hotel.address.isNotEmpty;
    // Step 3: nothing set at all, so say so instead of an empty page.
    if (!hasPhone && !hasEmail && !hasWhatsapp && !hasAddress) {
      return const StateMessage(
        icon: Icons.contact_phone_outlined,
        title: 'Contact details are not set yet',
        message: 'The hotel has not added its phone, email or WhatsApp yet. Please check again later.',
      );
    }
    return SingleChildScrollView(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: IgongoSpace.sm,
        children: [
          // Step 4: the hotel name and the front desk call icon, when a phone is set.
          if (hotel.name.isNotEmpty)
            Row(
              children: [
                Expanded(
                  child: Text(hotel.name.toUpperCase(), style: context.text.labelSmall?.copyWith(color: p.secondary)),
                ),
                if (hasPhone)
                  IconButton(
                    tooltip: 'Call the front desk',
                    icon: Icon(Icons.call, color: p.primary),
                    onPressed: () => callNumber(context, hotel.dialPhone),
                  ),
              ],
            ),
          // Step 5: the welcome line above the channels.
          Text(
            'How would you like to reach our front desk and concierge? We are honoured to assist your stay.',
            style: context.text.bodyMedium?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the phone channel, with the opening hours as its chip when set.
          if (hasPhone)
            ContactChannelCard(
              glyph: Icon(Icons.phone_in_talk_outlined, color: p.primary, size: 24),
              discColor: p.primaryContainer,
              title: 'Call Front Desk',
              chip: hotel.hours.isEmpty ? null : hotel.hours,
              detail: hotel.phone,
              actionLabel: 'Call Now',
              actionIcon: Icons.call,
              actionColor: p.primary,
              actionTextColor: p.onPrimary,
              onAction: () => callNumber(context, hotel.dialPhone),
            ),
          // Step 7: the email channel.
          if (hasEmail)
            ContactChannelCard(
              glyph: Icon(Icons.mail_outline, color: p.secondary, size: 24),
              discColor: p.accent.withValues(alpha: 0.2),
              title: 'Send an Email',
              detail: hotel.email,
              actionLabel: 'Send Email',
              actionIcon: Icons.send_outlined,
              actionColor: p.surfaceAlt,
              actionTextColor: p.text,
              onAction: () => emailAddress(context, hotel.email),
            ),
          // Step 8: the WhatsApp channel, using the same number as the other WhatsApp buttons.
          if (hasWhatsapp)
            ContactChannelCard(
              glyph: const WhatsappIcon(size: 24),
              discColor: p.success.withValues(alpha: 0.12),
              title: 'Chat on WhatsApp',
              chip: 'Live',
              chipLive: true,
              detail: '+${hotel.whatsapp}',
              actionLabel: 'Open WhatsApp',
              actionIcon: Icons.chat_bubble_outline,
              actionColor: p.success,
              actionTextColor: p.onPrimary,
              onAction: () => openWhatsappChat(context, ref),
            ),
          // Step 9: the location strip at the foot of the page, when an address is set.
          if (hasAddress) LocationStrip(caption: hotel.name, address: hotel.address),
        ],
      ),
    );
  }
}

/// The notice shown when the super admin has switched the Contact Us details off.
class _SwitchedOff extends StatelessWidget {
  /// Creates the notice.
  const _SwitchedOff();

  @override
  Widget build(BuildContext context) {
    return const StateMessage(
      icon: Icons.phone_disabled_outlined,
      title: 'Contact details are paused',
      message: 'The hotel has paused its contact details for now. Please try again later.',
    );
  }
}
