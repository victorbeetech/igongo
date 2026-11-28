// The "From our kitchen" row: a horizontal list of dish cards that slides by itself
// every 2 seconds and wraps back to the start, and can also be swiped by hand. Dishes
// come from the first outlet's menu in the API (only items on today and not containers).
// While loading, or when there are no dishes, the whole row (title included) is hidden,
// so no placeholder dish is ever shown.

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
import 'guest_section_title.dart';

/// The horizontal row of dish cards on the guest home.
class GuestDishRow extends ConsumerStatefulWidget {
  /// Creates the row; [onFullMenu] opens the full menu from the row's link.
  const GuestDishRow({super.key, required this.onFullMenu});

  /// Called when the "Full menu" link is tapped.
  final VoidCallback onFullMenu;

  @override
  ConsumerState<GuestDishRow> createState() => _GuestDishRowState();
}

class _GuestDishRowState extends ConsumerState<GuestDishRow> {
  /// The tag on real dishes until the menu API carries a tag.
  static const _realTag = 'On the menu';

  /// The rating and prep time are dashes until the menu API carries them.
  static const _placeholderRating = '— (—)';
  static const _placeholderPrepTime = '— mins';

  /// The row's height: the card plus room for its shadow.
  static const _rowHeight = 326.0;

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

    // Step 5: no dishes (none on the menu today, or the menu cannot load): hide the whole row, title included.
    if (items.isEmpty) return const SizedBox.shrink();
    final cards = [
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

    // Step 6: the title with its full-menu link, then the cards in a row that slides by itself and by hand.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GuestSectionTitle('From our kitchen', action: 'Full menu', onAction: widget.onFullMenu),
        Semantics(
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
        ),
      ],
    );
  }
}
