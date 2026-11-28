// Saves or removes a dish on the guest's saved list (the heart on a dish).
// Used by the dish page and the Saved Dishes screen.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'saved_dishes_providers.dart';

/// Saves dish [itemId] when [saved] is true, otherwise removes it, then reloads the list.
/// Throws when the server refuses (for example, the dish is no longer on the menu); the caller shows the message.
Future<void> setDishSaved(WidgetRef ref, {required String itemId, required bool saved}) async {
  // Step 1: change the guest's list on the server.
  final api = ref.read(savedDishesApiProvider);
  if (saved) {
    await api.save(itemId);
  } else {
    await api.remove(itemId);
  }
  // Step 2: the saved list reloads, so the heart and the Me row show the new state.
  ref.invalidate(savedDishesProvider);
}
