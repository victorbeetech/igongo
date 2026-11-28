// Loads the hotel's contact details from the public settings. Anyone may read them
// (the sign-in screen needs them too), so no sign-in is needed. A failed load
// surfaces as an error the screen shows with Try again; nothing is made up.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../api/api_client.dart';
import '../session/session_controller.dart';
import 'hotel_contact.dart';

/// The hotel's contact details, read fresh each time a screen opens it.
final hotelContactProvider = FutureProvider.autoDispose<HotelContact>((ref) async {
  // Step 1: ask the API for the public settings.
  final settings = await ref.watch(apiClientProvider).get('/api/public/settings');
  // Step 2: read the hotel section into the model.
  return HotelContact.fromSettings(settings);
});
