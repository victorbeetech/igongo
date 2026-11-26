// The hand-made screens of module 32 (Staff Meals), by screen number, live
// from the API. Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/meal_today/meal_today_screen.dart';

/// Module 32's hand-made screens.
final m32Overrides = <String, ScreenOverride>{
  'S32-01': (_, s) => MealTodayScreen(s),
  // Details open inside the screen above, so their numbers lead there too.
  'S32-02': (_, s) => MealTodayScreen(s),
};
