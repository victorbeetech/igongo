// Builds the wa.me link that opens a WhatsApp chat with the hotel, with the
// message already filled in. Pure Dart, so it can be tested without a device.

import 'whatsapp_config.dart';

/// Returns the wa.me link for [number] (digits only, international form), with [message] pre-filled.
Uri whatsAppLink({String number = defaultWhatsAppNumber, String message = defaultWhatsAppMessage}) =>
    Uri.https('wa.me', '/$number', {'text': message});
