// The WhatsApp number guests chat with, from the super admin's Hotel profile.
// It is null until the super admin sets one, so the app never opens a made-up chat.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'hotel_contact_provider.dart';

/// The WhatsApp number as digits with the country code, or null when the super admin has not set one.
final whatsappNumberProvider = FutureProvider.autoDispose<String?>((ref) async {
  // Step 1: read the hotel's contact details (throws if they cannot be loaded).
  final contact = await ref.watch(hotelContactProvider.future);
  // Step 2: an empty number means it is not set yet.
  return contact.whatsapp.isEmpty ? null : contact.whatsapp;
});
