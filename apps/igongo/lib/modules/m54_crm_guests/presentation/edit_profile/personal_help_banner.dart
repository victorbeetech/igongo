// The "Need personal help?" banner at the foot of the screen. Its round button
// opens the front desk on WhatsApp, through the one shared helper.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/contact/open_whatsapp_chat.dart';
import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';
import '../../../../../shared/ui/icons/round_icon_button.dart';

/// The front desk banner with its WhatsApp button.
class PersonalHelpBanner extends ConsumerWidget {
  /// Creates the banner.
  const PersonalHelpBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    return IgongoCard(
      color: p.surfaceAlt,
      padding: const EdgeInsets.all(IgongoSpace.md),
      child: Row(
        spacing: IgongoSpace.md,
        children: [
          // Step 1: the round badge with the desk's icon.
          Container(
            width: 40,
            height: 40,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: p.secondary, shape: BoxShape.circle),
            child: Icon(Icons.support_agent, size: 22, color: p.surface),
          ),
          // Step 2: the words, taking the room between.
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Need personal help?', style: context.text.labelLarge),
                Text('Igongo front desk is online 24/7', style: context.text.bodySmall),
              ],
            ),
          ),
          // Step 3: the button that opens the WhatsApp chat.
          RoundIconButton(
            icon: Icons.forum_outlined,
            tooltip: 'Chat with the Igongo front desk on WhatsApp',
            onPressed: () => openWhatsappChat(context, ref),
          ),
        ],
      ),
    );
  }
}
