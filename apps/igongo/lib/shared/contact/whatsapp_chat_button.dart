// The one reusable "chat on WhatsApp" button. It is a normal icon button (not a
// floating one), so the same button can sit in any top bar on any screen.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../ui/toast/igongo_toast.dart';
import '../ui/whatsapp/whatsapp_icon.dart';
import 'whatsapp_number.dart';

/// The WhatsApp icon button: opens WhatsApp to the company number with a short message ready.
class WhatsappChatButton extends ConsumerWidget {
  /// Creates the button.
  const WhatsappChatButton({super.key});

  /// The message that is already typed when WhatsApp opens.
  static const _hello = 'Hello Igongo, I need some help.';

  /// The icon's size in logical pixels.
  static const _iconSize = 24.0;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return IconButton(
      tooltip: 'Chat with us on WhatsApp',
      icon: const WhatsappIcon(size: _iconSize),
      onPressed: () async {
        // Step 1: the number, from the super admin's setting.
        final number = await ref.read(whatsappNumberProvider.future);
        // Step 2: tap-to-chat link with the short message; WhatsApp (or the browser) opens it.
        final link = Uri.parse('https://wa.me/$number?text=${Uri.encodeComponent(_hello)}');
        final opened = await launchUrl(link, mode: LaunchMode.externalApplication).catchError((_) => false);
        if (!opened && context.mounted) showIgongoToast(context, 'Could not open WhatsApp.');
      },
    );
  }
}
