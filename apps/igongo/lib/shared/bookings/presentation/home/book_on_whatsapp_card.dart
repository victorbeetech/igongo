// The short call-to-action shown on the Bookings home when the guest has no
// reservation. It invites them to book on WhatsApp and opens the chat with the
// company number (the same helper every WhatsApp button uses).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../contact/open_whatsapp_chat.dart';
import '../../../theme/theme.dart';
import '../../../ui/card/soft_card.dart';
import '../../../ui/whatsapp/whatsapp_icon.dart';

/// A short card that asks the guest to make a reservation on WhatsApp.
class BookOnWhatsappCard extends ConsumerWidget {
  /// Creates the card.
  const BookOnWhatsappCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    return SoftCard(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md, vertical: IgongoSpace.sm),
      // Step 1: the whole row opens the WhatsApp chat.
      onTap: () => openWhatsappChat(context, ref),
      child: Row(
        spacing: IgongoSpace.sm,
        children: [
          const WhatsappIcon(size: 28),
          // Step 2: one line of copy, shrinking with large text instead of wrapping into a tall card.
          Expanded(
            child: Text(
              'No stay yet? Make a reservation on WhatsApp.',
              style: context.text.bodyMedium?.copyWith(color: p.text),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Icon(Icons.chevron_right, color: p.primaryText),
        ],
      ),
    );
  }
}
