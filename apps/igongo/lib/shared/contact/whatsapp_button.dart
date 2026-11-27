// A small floating chat button on the guest screens: it opens WhatsApp to the
// company number (set by the super admin) with a short message ready to send.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../theme/theme.dart';
import '../ui/toast/igongo_toast.dart';
import '../ui/whatsapp/whatsapp_icon.dart';
import 'whatsapp_number.dart';

/// The floating "chat on WhatsApp" button.
class WhatsappButton extends ConsumerWidget {
  /// Creates the button.
  const WhatsappButton({super.key});

  /// The message that is already typed when WhatsApp opens.
  static const _hello = 'Hello Igongo, I need some help.';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final p = context.palette;
    return FloatingActionButton.small(
      heroTag: 'whatsapp-chat',
      tooltip: 'Chat with us on WhatsApp',
      backgroundColor: p.primary,
      foregroundColor: p.onPrimary,
      onPressed: () async {
        // Step 1: the number, from the super admin's setting.
        final number = await ref.read(whatsappNumberProvider.future);
        // Step 2: tap-to-chat link with the short message; WhatsApp (or the browser) opens it.
        final link = Uri.parse('https://wa.me/$number?text=${Uri.encodeComponent(_hello)}');
        final opened = await launchUrl(link, mode: LaunchMode.externalApplication).catchError((_) => false);
        if (!opened && context.mounted) showIgongoToast(context, 'Could not open WhatsApp.');
      },
      // The WhatsApp icon in the button's text colour, so it reads in light and dark.
      child: WhatsappIcon(colour: p.onPrimary),
    );
  }
}
