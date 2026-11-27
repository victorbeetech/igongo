// The floating WhatsApp concierge button, bottom right. It uses the WhatsApp
// green from the theme. The number is not set yet, so tapping does nothing
// (placeholder until the hotel's WhatsApp is connected).

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
      child: DecoratedBox(
        // A soft shadow under a plain green disc (no outline ring, as on the reference).
        decoration: BoxDecoration(
          color: p.whatsapp,
          shape: BoxShape.circle,
          boxShadow: [BoxShadow(color: p.text.withValues(alpha: 0.2), blurRadius: 10, offset: const Offset(0, 4))],
        ),
        child: Material(
          color: Colors.transparent,
          shape: const CircleBorder(),
          child: InkWell(
            customBorder: const CircleBorder(),
            // Placeholder: no action until the hotel's WhatsApp number is set.
            onTap: null,
            child: SizedBox(
              width: 52,
              height: 52,
              child: Icon(Icons.chat_outlined, color: p.onPrimary, size: 26),
            ),
          ),
        ),
      ),
    );
  }
}
