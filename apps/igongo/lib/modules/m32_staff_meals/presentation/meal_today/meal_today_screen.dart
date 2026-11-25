// S32-01 Meal today, live: each staff meal today, its serving hours, and
// whether I have had it. Meals are claimed by tapping my card at the canteen.
// Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/meal_providers.dart';
import '../../domain/my_meal.dart';

/// Meal today.
class MealTodayScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MealTodayScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<MyMeal>>(
    screenName: screen.spec.name,
    value: ref.watch(myMealsProvider),
    onRetry: () => ref.invalidate(myMealsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, meals, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Empty: the super admin has turned every meal off.
        if (meals.isEmpty) const IgongoListRow(title: 'No staff meals today'),
        // One row per meal: hours, then had / open now / closed.
        for (final m in meals)
          IgongoListRow(
            title: m.name,
            subtitle: '${m.startsAt} to ${m.endsAt} · tap your card at the canteen',
            status: _statusOf(m),
            leading: Icon(m.servedAt == null ? Icons.restaurant_outlined : Icons.check_circle_outline),
          ),
      ],
    ),
  );

  /// The word on a meal's chip.
  String _statusOf(MyMeal m) {
    if (m.servedAt != null) return 'Had';
    return m.openNow ? 'Serving now' : 'Not serving';
  }
}
