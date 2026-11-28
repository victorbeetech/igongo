// Live saved dishes for the Me screen, the Saved Dishes screen and the dish
// page's heart (Riverpod). The list reloads when the session changes.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/saved_dishes_api.dart';
import '../domain/saved_dish.dart';

/// The saved-dish API on the app's client.
final savedDishesApiProvider = Provider((ref) => SavedDishesApi(ref.watch(apiClientProvider)));

/// My saved dishes. Reloads when the session changes, and after a dish is saved or removed.
final savedDishesProvider = FutureProvider.autoDispose<List<SavedDish>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(savedDishesApiProvider).list();
});
