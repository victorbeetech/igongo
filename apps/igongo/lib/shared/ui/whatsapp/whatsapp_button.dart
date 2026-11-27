// The floating WhatsApp button: a green round button that opens a chat with
// the hotel. Colours come from the theme, so screens never style it themselves.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../theme/theme.dart';
import '../../whatsapp/whatsapp_link.dart';

/// A round floating button that opens WhatsApp with the hotel's chat.
class WhatsAppButton extends StatelessWidget {
  /// Creates the button.
  const WhatsAppButton({super.key});

  /// Opens the chat in the WhatsApp app (or the browser if WhatsApp is not installed).
  Future<void> _open() async {
    // Step 1: launch the link outside the app, so WhatsApp itself opens.
    await launchUrl(whatsAppLink(), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      button: true,
      label: 'Chat with Igongo on WhatsApp',
      child: Material(
        // Step 2: the success colour from the theme, as the WhatsApp green.
        color: p.success,
        shape: const CircleBorder(),
        elevation: 4,
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: _open,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Icon(Icons.chat, color: p.onPrimary),
          ),
        ),
      ),
    );
  }
}
