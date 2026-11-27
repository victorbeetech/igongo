// The "From our kitchen" row: a horizontal list of dish cards that slides by itself
// every 2 seconds and wraps back to the start, and can also be swiped by hand. Dishes
// come from the first outlet's menu in the API (only items on today and not containers).
// While loading, or when there are no dishes, placeholder cards keep the same layout.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/format/ugx.dart';
import '../../../../m62_food_ordering/application/cart_controller.dart';
import '../../../../m62_food_ordering/application/orders_providers.dart';
import '../../../../m62_food_ordering/domain/menu_item.dart';
import '../../../../m62_food_ordering/presentation/item_page.dart';
import 'guest_dish_card.dart';

/// The horizontal row of dish cards on the guest home.
class GuestDishRow extends ConsumerStatefulWidget {
  /// Creates the row.
  const GuestDishRow({super.key});

  @override
  ConsumerState<GuestDishRow> createState() => _GuestDishRowState();
}

class _GuestDishRowState extends ConsumerState<GuestDishRow> {
  /// The tags on the placeholder cards, as the design shows them (words only, no data).
  static const _placeholderTags = ['Best seller', 'Chef specialty', 'Wood smoked'];

  /// Demo pictures for the placeholder cards, one per card, from the owner's photos.
  static const _placeholderAssets = [
    'assets/photos/food-dish.jpg',
    'assets/photos/food-fish-plated.jpg',
    'assets/photos/outlet-restaurant.jpg',
  ];

  /// The tag on real dishes until the menu API carries a tag.
  static const _realTag = 'On the menu';

  /// The rating and prep time are dashes until the menu API carries them.
  static const _placeholderRating = '— (—)';
  static const _placeholderPrepTime = '— mins';

  /// The row's height: the card plus room for its shadow.
  static const _rowHeight = 300.0;

  /// The gap between two cards.
  static const _gap = IgongoSpace.md;

  /// How long each card stays before the row slides on.
  static const _interval = Duration(seconds: 2);

  /// How long one slide takes.
  static const _slideDuration = Duration(milliseconds: 400);

  /// Drives the list, so the timer and swipes move the same cards.
  final _controller = ScrollController();

  /// The timer that slides the row on.
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    // Step 1: every tick slides the row by one card, and wraps back to the start at the end.
    _timer = Timer.periodic(_interval, (_) => _advance());
  }

  /// Slides the row to the next card, or back to the first card after the last.
  void _advance() {
    if (!_controller.hasClients) return;
    final position = _controller.position;
    const step = GuestDishCard.width + _gap;
    final next = position.pixels + step;
    if (next > position.maxScrollExtent) {
      // Step 2: at the end, go back to the first card without a slide.
      _controller.jumpTo(0);
    } else {
      _controller.animateTo(next, duration: _slideDuration, curve: Curves.easeInOut);
    }
  }

  @override
  void dispose() {
    // Step 3: stop the timer and release the controller when the row leaves the screen.
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Step 4: the first outlet, then its available dishes (containers are not dishes).
    final outlet = ref.watch(outletsProvider).valueOrNull?.firstOrNull;
    final items = outlet == null
        ? const <MenuItem>[]
        : [
            for (final i in ref.watch(menuProvider(outlet.key)).valueOrNull ?? const <MenuItem>[])
              if (i.available && !i.isContainer) i,
          ];

    // Step 5: real dishes when there are any; otherwise placeholder cards in the same layout.
    final cards = items.isEmpty
        ? [
            for (var i = 0; i < _placeholderTags.length; i++)
              GuestDishCard(
                name: 'Dish name',
                description: 'Dishes will appear here',
                price: 'UGX —',
                tag: _placeholderTags[i],
                rating: _placeholderRating,
                prepTime: _placeholderPrepTime,
                asset: _placeholderAssets[i],
              ),
          ]
        : [
            for (final item in items)
              GuestDishCard(
                name: item.name,
                description: item.description ?? '',
                price: ugx(item.price),
                tag: _realTag,
                rating: _placeholderRating,
                prepTime: _placeholderPrepTime,
                onTap: () {
                  // Opening a dish sets its outlet as the cart's, then opens the dish page.
                  ref.read(cartProvider.notifier).useOutlet(outlet!.key);
                  openItemPage(context, item);
                },
              ),
          ];

    // Step 6: the cards in a row that slides by itself and by hand, with the page's edge margins.
    return Semantics(
      label: 'Meals to order',
      container: true,
      child: SizedBox(
        height: _rowHeight,
        child: ListView.separated(
          controller: _controller,
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          itemCount: cards.length,
          separatorBuilder: (_, _) => const SizedBox(width: _gap),
          itemBuilder: (_, i) => cards[i],
        ),
      ),
    );
  }
}
