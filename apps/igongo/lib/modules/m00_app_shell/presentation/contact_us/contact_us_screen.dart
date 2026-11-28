// S00-46 Contact Us: three ways to reach the hotel (phone, email, WhatsApp) and
// the location. Opened from the "Contact Us" links on the sign-in and create
// account screens. Every number, the address and the email come from the super
// admin's Hotel profile (public settings), never from fixed text.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/contact/contact_launchers.dart';
import '../../../../shared/contact/open_whatsapp_chat.dart';
import '../../../../shared/hotel/application/public_settings_providers.dart';
import '../../../../shared/hotel/domain/hotel_profile.dart';
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
    // Step 1: the hotel details come from the admin. Loading and error get their own states.
    final settings = ref.watch(publicSettingsProvider);
    return settings.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, _) => _RetryNotice(onRetry: () => ref.invalidate(publicSettingsProvider)),
      data: (data) => _ContactBody(hotel: data.hotel),
    );
  }
}

/// The page body once the hotel details are loaded: the top row, the three channels and the location.
class _ContactBody extends ConsumerWidget {
  const _ContactBody({required this.hotel});

  /// The hotel details from the super admin.
  final HotelProfile hotel;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: read the theme colours for the page.
    final p = context.palette;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 2: the hotel name and the call icon, which dials the front desk number.
          Row(
            children: [
              Expanded(
                child: Text(hotel.name.toUpperCase(), style: context.text.labelSmall?.copyWith(color: p.secondary)),
              ),
              IconButton(
                tooltip: 'Call the front desk',
                icon: Icon(Icons.call, color: p.primary),
                onPressed: () => callNumber(context, hotel.phone),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            'How would you like to reach our front desk and concierge? We are honoured to assist your stay.',
            style: context.text.bodyMedium?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: the three channels, one card each, with a small gap between.
          ContactChannelCard(
            glyph: Icon(Icons.phone_in_talk_outlined, color: p.primary, size: 24),
            discColor: p.primaryContainer,
            title: 'Call Front Desk',
            chip: '24/7',
            detail: _detailOrNotSet(hotel.phone, 'Available 24/7'),
            actionLabel: 'Call Now',
            actionIcon: Icons.call,
            actionColor: p.primary,
            actionTextColor: p.onPrimary,
            onAction: () => callNumber(context, hotel.phone),
          ),
          const SizedBox(height: IgongoSpace.sm),
          ContactChannelCard(
            glyph: Icon(Icons.mail_outline, color: p.secondary, size: 24),
            discColor: p.accent.withValues(alpha: 0.2),
            title: 'Send an Email',
            chip: '~2h Reply',
            detail: _detailOrNotSet(hotel.email, 'Fast reply within 2 hrs'),
            actionLabel: 'Send Email',
            actionIcon: Icons.send_outlined,
            actionColor: p.surfaceAlt,
            actionTextColor: p.text,
            onAction: () => emailAddress(context, hotel.email),
          ),
          const SizedBox(height: IgongoSpace.sm),
          ContactChannelCard(
            glyph: const WhatsappIcon(size: 24),
            discColor: p.success.withValues(alpha: 0.12),
            title: 'Chat on WhatsApp',
            chip: 'Live',
            chipLive: true,
            detail: _detailOrNotSet(hotel.whatsapp, 'Instant chat with Guest Butler'),
            actionLabel: 'Open WhatsApp',
            actionIcon: Icons.chat_bubble_outline,
            actionColor: p.success,
            actionTextColor: p.onPrimary,
            onAction: () => openWhatsappChat(context, ref),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the location strip at the foot of the page, from the hotel's address.
          LocationStrip(caption: 'Hotel & Cultural Grounds', address: hotel.address),
        ],
      ),
    );
  }

  /// The detail line: the value and the note, or a "not set yet" line when the admin has left the value empty.
  static String _detailOrNotSet(String value, String note) =>
      value.trim().isEmpty ? 'Not set yet' : '$value • $note';
}

/// Shown when the hotel details cannot be read: a sentence and a retry button.
class _RetryNotice extends StatelessWidget {
  const _RetryNotice({required this.onRetry});

  /// Asks the screen to read the details again.
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('We could not load the contact details.', style: context.text.bodyMedium),
        TextButton(onPressed: onRetry, child: const Text('Try again')),
      ],
    ),
  );
}
