// The one floating WhatsApp button. It sits in the bottom corner, above the bottom bar,
// on every guest screen, and does not scroll with the page. It is drawn by the app
// shell (not by a screen), so there is only one of it to change.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../theme/theme.dart';
import '../ui/whatsapp/whatsapp_icon.dart';
import 'open_whatsapp_chat.dart';

/// The floating WhatsApp button: a white round button with the green WhatsApp icon.
class WhatsappFloatButton extends ConsumerWidget {
  /// Creates the button.
  const WhatsappFloatButton({super.key});

  /// The icon's size in logical pixels.
  static const double _iconSize = 32;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: a round surface, the WhatsApp icon keeps its own green.
    final p = context.palette;
    return FloatingActionButton(
      tooltip: 'Chat with us on WhatsApp',
      // No hero animation: only one of these exists, and a hero would clash between pages.
      heroTag: null,
      backgroundColor: p.surface,
      // Step 1b: no shadow and no outline, so only the plain WhatsApp icon shows on the round surface.
      elevation: 0,
      focusElevation: 0,
      hoverElevation: 0,
      highlightElevation: 0,
      shape: const CircleBorder(side: BorderSide.none),
      onPressed: () => openWhatsappChat(context, ref),
      // Step 2: the icon, drawn from the SVG in its own green.
      child: const WhatsappIcon(size: _iconSize),
    );
  }
}
