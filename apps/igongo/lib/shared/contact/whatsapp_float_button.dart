// The one floating WhatsApp button. It sits in the bottom corner, above the bottom bar,
// on every guest screen, and does not scroll with the page. It is drawn by the app
// shell (not by a screen), so there is only one of it to change.
//
// The button is a round disc in the theme's surface colour (cream in light mode, dark
// brown in dark mode) with a soft shadow, and the green WhatsApp glyph sits inside it.
// Every colour comes from the theme tokens (context.palette), so changing the token
// file updates this button too.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/theme_context.dart';
import '../ui/whatsapp/whatsapp_icon.dart';
import 'open_whatsapp_chat.dart';

/// The floating WhatsApp button: the WhatsApp glyph inside a round themed disc.
class WhatsappFloatButton extends ConsumerWidget {
  /// Creates the button.
  const WhatsappFloatButton({super.key});

  /// The glyph's size in logical pixels, sized to sit inside the disc with room around it.
  static const double _iconSize = 30;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: read the theme colours for the current mode (light or dark).
    final p = context.palette;
    return FloatingActionButton(
      tooltip: 'Chat with us on WhatsApp',
      // No hero animation: only one of these exists, and a hero would clash between pages.
      heroTag: null,
      // Step 2: the round disc takes the theme's surface colour, so it follows light and dark mode.
      backgroundColor: p.surface,
      // Step 3: a soft shadow lifts the disc off the page (the same shadow idea as the cards).
      elevation: 6,
      focusElevation: 8,
      hoverElevation: 8,
      highlightElevation: 8,
      shape: const CircleBorder(),
      onPressed: () => openWhatsappChat(context, ref),
      // Step 4: the WhatsApp glyph in its own green, centred inside the disc.
      child: const WhatsappIcon(size: _iconSize),
    );
  }
}
