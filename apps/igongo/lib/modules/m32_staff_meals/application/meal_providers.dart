// Staff Meals' live data for the app's screens (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/meals_api.dart';
import '../domain/my_meal.dart';

/// The Staff Meals API on the app's client.
final mealsApiProvider = Provider((ref) => MealsApi(ref.watch(apiClientProvider)));

/// My meals today; reloads when the session changes.
final myMealsProvider = FutureProvider.autoDispose<List<MyMeal>>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(mealsApiProvider).today();
});
