// "From our kitchen": the dishes of the first outlet, shown one card at a time
// at full size, moving to the next card every two seconds. Dishes come live
// from the menu API; nothing is shown while loading or if the menu is empty.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../m62_food_ordering/application/orders_providers.dart';
import '../../../m62_food_ordering/domain/menu_item.dart';
import 'kitchen_card.dart';

/// The auto-advancing slides of dishes.
class KitchenSlides extends ConsumerStatefulWidget {
  /// Creates the slides; [screen] opens each dish's page.
  const KitchenSlides(this.screen, {super.key});

  /// The guest home's context, used to open the food screen.
  final ScreenContext screen;

  @override
  ConsumerState<KitchenSlides> createState() => _KitchenSlidesState();
}

class _KitchenSlidesState extends ConsumerState<KitchenSlides> {
  /// Each slide is this tall, so the cards keep one size.
  static const double _height = 220;

  /// How long each dish stays on screen before the next one.
  static const Duration _interval = Duration(seconds: 2);

  // Moves the slides on a timer.
  final PageController _pages = PageController(viewportFraction: 0.9);
  Timer? _timer;

  // How many dishes the timer cycles through, kept up to date by build.
  int _count = 0;

  @override
  void initState() {
    super.initState();
    // Step 1: start the timer; it steps to the next dish every interval.
    _timer = Timer.periodic(_interval, (_) => _advance());
  }

  @override
  void dispose() {
    // Step 2: stop the timer and release the page controller.
    _timer?.cancel();
    _pages.dispose();
    super.dispose();
  }

  /// Moves to the next dish, wrapping to the first after the last.
  void _advance() {
    if (_count < 2 || !_pages.hasClients) return;
    final next = ((_pages.page ?? 0).round() + 1) % _count;
    _pages.animateToPage(next, duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
  }

  @override
  Widget build(BuildContext context) {
    // Step 3: the first outlet's menu, once the outlets have loaded.
    final outlets = ref.watch(outletsProvider);
    return outlets.when(
      loading: () => const SizedBox(height: _height),
      error: (_, _) => const SizedBox.shrink(),
      data: (list) {
        if (list.isEmpty) return const SizedBox.shrink();
        return ref
            .watch(menuProvider(list.first.key))
            .when(
              loading: () => const SizedBox(height: _height),
              error: (_, _) => const SizedBox.shrink(),
              data: (items) => _slides(items.where((i) => i.available).toList()),
            );
      },
    );
  }

  /// Builds the slides for [dishes]; each one opens the food screen when tapped.
  Widget _slides(List<MenuItem> dishes) {
    // Step 4: remember how many dishes there are, for the timer.
    _count = dishes.length;
    if (dishes.isEmpty) return const SizedBox.shrink();
    return SizedBox(
      height: _height,
      child: PageView.builder(
        controller: _pages,
        itemCount: dishes.length,
        itemBuilder: (context, i) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xs),
          child: KitchenCard(item: dishes[i], onTap: () => widget.screen.open('S62-14')),
        ),
      ),
    );
  }
}
