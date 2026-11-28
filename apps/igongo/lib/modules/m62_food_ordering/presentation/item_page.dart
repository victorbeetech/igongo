// The page for one dish, opened by tapping it. Top to bottom: the photo (with
// prep time), the overview card (section, name, price, description, tags and
// allergens), the customisation sections the restaurant set up (radio or
// checkbox), a note for the kitchen, and a bottom bar with the quantity and
// Add to Order. Every word and price comes from the menu API; the total is
// worked out from the picks and the quantity on this screen.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/session/session_controller.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/cart_controller.dart';
import '../application/saved_dish_toggle.dart';
import '../application/saved_dishes_providers.dart';
import '../domain/cart_line.dart';
import '../domain/dish_pricing.dart';
import '../domain/menu_item.dart';
import '../domain/option_group.dart';
import '../domain/saved_dish.dart';
import 'dish/dish_hero.dart';
import 'dish/dish_note_field.dart';
import 'dish/dish_option_section.dart';
import 'dish/dish_order_bar.dart';
import 'dish/dish_overview_card.dart';
import 'dish/dish_top_bar.dart';

/// Opens [item]'s page over the current screen (it has a Back arrow).
Future<void> openItemPage(BuildContext context, MenuItem item) =>
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ItemPage(item: item)));

/// The page for [item].
class ItemPage extends ConsumerStatefulWidget {
  /// Creates the page.
  const ItemPage({super.key, required this.item});

  /// The dish.
  final MenuItem item;

  @override
  ConsumerState<ItemPage> createState() => _ItemPageState();
}

class _ItemPageState extends ConsumerState<ItemPage> {
  /// Height of the photo, in logical pixels.
  static const _heroHeight = 300.0;

  /// How far the guest must scroll (pixels) before the dish name appears in the top bar.
  static const _titleAfter = 180.0;

  /// The most dishes one line may hold.
  static const _maxQuantity = 20;

  /// Scroll position of the page, to show the name in the top bar.
  final _scroll = ScrollController();

  /// The guest's note for the kitchen on this dish.
  final _note = TextEditingController();

  /// How many dishes the guest wants.
  int _quantity = 1;

  /// The picked choice keys per option group.
  DishPicks _picks = {};

  /// True once the guest has scrolled past the photo.
  bool _titleShown = false;

  @override
  void initState() {
    super.initState();
    // Step 1: follow the scroll so the top bar can show the dish name.
    _scroll.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scroll
      ..removeListener(_onScroll)
      ..dispose();
    _note.dispose();
    super.dispose();
  }

  /// Shows the dish name in the top bar only after the guest scrolls past [_titleAfter].
  void _onScroll() {
    final shown = _scroll.hasClients && _scroll.offset > _titleAfter;
    if (shown != _titleShown) setState(() => _titleShown = shown);
  }

  /// Sets the count, kept between 1 and [_maxQuantity].
  void _setQuantity(int quantity) => setState(() => _quantity = quantity.clamp(1, _maxQuantity));

  /// Picks [choice] in a single-choice (radio) group.
  void _choose(OptionGroup group, String choice) => setState(() => _picks = dishChoose(_picks, group, choice));

  /// Flips [choice] in a multi-choice (checkbox) group.
  void _toggle(OptionGroup group, String choice) => setState(() => _picks = dishTogglePick(_picks, group, choice));

  /// Saves this dish to the guest's saved list, or removes it when [saved]. Signed out, it asks for a sign-in first.
  Future<void> _toggleSaved(bool saved) async {
    // Step 1: saved dishes belong to a guest account, so a visitor is asked to sign in.
    if (ref.read(sessionProvider).valueOrNull == null) return showIgongoToast(context, 'Sign in to save dishes.');
    // Step 2: change the list; a refusal (such as the dish leaving the menu) shows as a toast.
    try {
      await setDishSaved(ref, itemId: widget.item.id, saved: !saved);
      if (mounted) showIgongoToast(context, saved ? 'Removed from saved dishes' : 'Saved to your dishes');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    }
  }

  /// Adds the dish to the cart once every required group has a pick, then goes back to the menu.
  void _add() {
    final item = widget.item;
    // Step 1: stop and say which required group still needs a pick.
    final missing = dishMissingRequired(item, _picks);
    if (missing.isNotEmpty) return showIgongoToast(context, 'Pick ${missing.first.name}.');
    // Step 2: the cart gets the picks, the unit price with them, and the note (or none).
    final note = _note.text.trim();
    ref
        .read(cartProvider.notifier)
        .add(
          CartLine(
            itemId: item.id,
            name: item.name,
            quantity: _quantity,
            options: dishCartOptions(_picks),
            unitPrice: dishUnitPrice(item, _picks),
            notes: note.isEmpty ? null : note,
          ),
        );
    // Step 3: back to the menu.
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    // Step 0: is this dish on the guest's saved list? Only a signed-in guest has one; false while loading or on a failed load.
    final signedIn = ref.watch(sessionProvider).valueOrNull != null;
    final saved = signedIn && (ref.watch(savedDishesProvider).valueOrNull ?? const <SavedDish>[]).any((d) => d.itemId == widget.item.id);
    final item = widget.item;
    final palette = context.palette;
    final total = dishTotal(item, _picks, _quantity);
    return Scaffold(
      backgroundColor: palette.background,
      body: Stack(
        children: [
          // Layer 1: the scrolling page. Its bottom padding keeps the last section clear of the order bar.
          ListView(
            controller: _scroll,
            padding: const EdgeInsets.only(bottom: IgongoSpace.xxl * 4),
            children: [
              DishHero(photoUrl: item.photoUrl, prepMinutes: item.prepMinutes, height: _heroHeight),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    DishOverviewCard(item: item),
                    // The customisation sections, in the order the menu sets them.
                    for (final group in item.options) ...[
                      const SizedBox(height: IgongoSpace.lg),
                      DishOptionSection(
                        group: group,
                        picked: _picks[group.key] ?? const <String>{},
                        onChoose: (c) => _choose(group, c),
                        onToggle: (c) => _toggle(group, c),
                      ),
                    ],
                    const SizedBox(height: IgongoSpace.lg),
                    DishNoteField(controller: _note),
                  ],
                ),
              ),
            ],
          ),
          // Layer 2: the top bar floats over the photo.
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: DishTopBar(
              name: item.name,
              titleShown: _titleShown,
              onBack: () => Navigator.of(context).maybePop(),
              saved: saved,
              onFavourite: () => _toggleSaved(saved),
            ),
          ),
          // Layer 3: the order bar sits at the bottom.
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: DishOrderBar(
              quantity: _quantity,
              total: total,
              canAdd: item.available,
              onQuantity: _setQuantity,
              onAdd: _add,
            ),
          ),
        ],
      ),
    );
  }
}
