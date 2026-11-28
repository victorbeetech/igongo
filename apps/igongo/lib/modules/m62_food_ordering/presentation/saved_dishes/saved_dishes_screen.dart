// Saved Dishes: the dishes the guest saved with the heart, each with today's
// price and whether it is on the menu. The heart removes a dish. Live from the
// API; with nothing saved it says so in one line. Signed out, it asks to sign in.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/format/ugx.dart';
import '../../../../shared/layout/igongo_scaffold.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/chip/status_chip.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/saved_dish_toggle.dart';
import '../../application/saved_dishes_providers.dart';
import '../../domain/saved_dish.dart';

/// The screen's name, used in its title and messages.
const _title = 'Saved Dishes';

/// The list of saved dishes, live from the API.
class SavedDishesScreen extends ConsumerWidget {
  /// Creates the screen.
  const SavedDishesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) => IgongoScaffold(
    title: _title,
    body: RefreshIndicator(
      onRefresh: () => ref.refresh(savedDishesProvider.future),
      child: LiveView<List<SavedDish>>(
        screenName: _title,
        value: ref.watch(savedDishesProvider),
        onRetry: () => ref.invalidate(savedDishesProvider),
        // The design preview has no saved dishes to show, so it shows the empty state.
        sample: (_) => const _DishList(dishes: []),
        builder: (context, dishes, _) => _DishList(dishes: dishes),
      ),
    ),
  );
}

/// The saved dishes as cards, or a line when there are none.
class _DishList extends StatelessWidget {
  /// Creates the list.
  const _DishList({required this.dishes});

  /// The saved dishes, newest first.
  final List<SavedDish> dishes;

  @override
  Widget build(BuildContext context) {
    // Step 1: nothing saved yet, so say how to save one.
    if (dishes.isEmpty) {
      return ScreenListView(
        children: [
          Padding(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Text('No saved dishes yet. Tap the heart on a dish to save it.', style: context.text.bodyMedium),
          ),
        ],
      );
    }
    // Step 2: one card per dish.
    return ScreenListView(
      children: [
        for (final d in dishes)
          Padding(
            padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
            child: _DishCard(dish: d),
          ),
      ],
    );
  }
}

/// One saved dish: its name, price, whether it is on today, and the heart to remove it.
class _DishCard extends ConsumerWidget {
  /// Creates the card.
  const _DishCard({required this.dish});

  /// The dish shown.
  final SavedDish dish;

  /// Removes the dish from the saved list; a refusal shows as a toast.
  Future<void> _remove(BuildContext context, WidgetRef ref) async {
    try {
      await setDishSaved(ref, itemId: dish.itemId, saved: false);
    } on ApiException catch (e) {
      if (context.mounted) showIgongoToast(context, e.message);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => IgongoCard(
    child: Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: IgongoSpace.xs,
            children: [
              Text(dish.name, style: context.text.titleMedium),
              Text(ugx(dish.price), style: context.text.bodySmall),
              // Dishes switched off today are kept on the list, marked as not available.
              if (!dish.available) const StatusChip('Not available today'),
            ],
          ),
        ),
        IconButton(
          tooltip: 'Remove from saved dishes',
          onPressed: () => _remove(context, ref),
          icon: Icon(Icons.favorite, color: context.palette.primary),
        ),
      ],
    ),
  );
}
