// The floating WhatsApp concierge button, bottom right. It uses the WhatsApp
// green from the theme. The number is not set yet, so tapping does nothing
// (placeholder until the hotel's WhatsApp is connected).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The round WhatsApp chat button.
class WhatsAppButton extends StatelessWidget {
  /// Creates the button; it has no tap action until the number is connected.
  const WhatsAppButton({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: 'Chat on WhatsApp',
      child: Material(
        color: p.whatsapp,
        shape: const CircleBorder(),
        elevation: IgongoElevation.sheet,
        child: InkWell(
          customBorder: const CircleBorder(),
          // Placeholder: no action until the hotel's WhatsApp number is set.
          onTap: null,
          child: SizedBox(
            width: 52,
            height: 52,
            child: Icon(Icons.chat_outlined, color: context.palette.onPrimary, size: 26),
          ),
        ),
      ),
    );
  }
}
