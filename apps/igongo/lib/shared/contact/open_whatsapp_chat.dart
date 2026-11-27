// Opens WhatsApp to the company number with a short message already typed.
// It is the one place that builds the WhatsApp chat link, so every button shares it.

import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../ui/toast/igongo_toast.dart';
import 'whatsapp_number.dart';

/// The message that is already typed when WhatsApp opens.
const String whatsappHelloMessage = 'Hello Igongo, I need some help.';

/// Opens the WhatsApp chat with the super admin's number. Shows a short notice if it cannot open.
Future<void> openWhatsappChat(BuildContext context, WidgetRef ref) async {
  // Step 1: the number, from the super admin's setting.
  final number = await ref.read(whatsappNumberProvider.future);
  // Step 2: tap-to-chat link with the short message; WhatsApp (or the browser) opens it.
  final link = Uri.parse('https://wa.me/$number?text=${Uri.encodeComponent(whatsappHelloMessage)}');
  final opened = await launchUrl(link, mode: LaunchMode.externalApplication).catchError((_) => false);
  // Step 3: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open WhatsApp.');
}
