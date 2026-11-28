// Opens WhatsApp to the hotel's number, with a short message already typed.
// It is the one place that builds the WhatsApp chat link, so every button shares it.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../hotel/application/public_settings_providers.dart';
import '../ui/toast/igongo_toast.dart';
import 'whatsapp_digits.dart';

/// The message that is already typed when WhatsApp opens.
const String whatsappHelloMessage = 'Hello Igongo, I need some help.';

/// Opens the WhatsApp chat with the number the super admin set. Says so if the number is not set or WhatsApp cannot open.
Future<void> openWhatsappChat(BuildContext context, WidgetRef ref) async {
  // Step 1: the number from the public settings (the super admin's Hotel profile).
  final number = await _hotelWhatsapp(ref);
  if (number.isEmpty) {
    if (context.mounted) showIgongoToast(context, 'WhatsApp is not set up yet.');
    return;
  }
  // Step 2: tap-to-chat link with the short message; WhatsApp (or the browser) opens it.
  final link = Uri.parse('https://wa.me/$number?text=${Uri.encodeComponent(whatsappHelloMessage)}');
  final opened = await launchUrl(link, mode: LaunchMode.externalApplication).catchError((_) => false);
  // Step 3: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open WhatsApp.');
}

/// The digits of the hotel's WhatsApp number, or empty when the admin has not set one or the settings cannot be read.
Future<String> _hotelWhatsapp(WidgetRef ref) async {
  try {
    final settings = await ref.read(publicSettingsProvider.future);
    return whatsappDigits(settings.hotel.whatsapp);
  } on Object {
    return '';
  }
}
