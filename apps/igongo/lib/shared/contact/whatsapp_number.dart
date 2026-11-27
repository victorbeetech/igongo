// The company WhatsApp number guests chat with. The super admin sets it in the
// web settings (Hotel profile, "Whatsapp"); the app reads it from the public
// settings. Until the server answers it uses the demo number below.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../session/session_controller.dart';

/// The demo number (0793128137 in Uganda's international form).
const String demoWhatsappNumber = '256793128137';

/// Turns a typed number into digits with the country code: "0793 128 137" becomes 256793128137.
String whatsappDigits(String typed) {
  final digits = typed.replaceAll(RegExp(r'[^0-9]'), '');
  return digits.startsWith('0') ? '256${digits.substring(1)}' : digits;
}

/// The number to chat with, from the super admin's settings (the demo number when unset or unreachable).
final whatsappNumberProvider = FutureProvider.autoDispose<String>((ref) async {
  try {
    final settings = await ref.watch(apiClientProvider).get('/api/public/settings');
    final typed = (settings['hotel'] as Json?)?['whatsapp'] as String?;
    final digits = whatsappDigits(typed ?? '');
    return digits.isEmpty ? demoWhatsappNumber : digits;
  } on Object {
    return demoWhatsappNumber;
  }
});
