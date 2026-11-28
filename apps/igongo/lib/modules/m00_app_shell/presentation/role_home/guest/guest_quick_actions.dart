// The five quick actions under the hero card: Book stay, Dine in, Museum, Spa and Pool.
// They sit in two rows that scroll sideways by swiping. Every card is the same size, taken
// from the design tokens. There is no automatic scrolling. [onOpen] opens the screen for an area.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import 'guest_quick_action.dart';
import 'guest_quick_action_column.dart';
import 'guest_service_placeholder_page.dart';

/// The grid of five quick-action cards, two rows high, swiped sideways.
class GuestQuickActions extends StatelessWidget {
  /// Creates the grid; [onOpen] receives the screen ID to open.
  const GuestQuickActions({super.key, required this.onOpen});

  /// Called with the screen ID of the tapped action.
  final void Function(String screenId) onOpen;

  /// The screen for room booking (the Rooms list).
  static const _stay = 'S67-01';

  /// The food home, for dining.
  static const _dine = 'S62-01';

  /// The museum's home.
  static const _museum = 'S68-01';

  /// Opens the placeholder page for a service that has no screen yet.
  static void _openPlaceholder(BuildContext context, String title) {
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GuestServicePlaceholderPage(title: title)));
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: the five actions in reading order. They are filled down each column first,
    // so the first column holds Book stay over Dine in, the second Museum over Spa, and so on.
    final actions = <Widget>[
      GuestQuickAction(
        icon: Icons.hotel_outlined,
        title: 'Book stay',
        subtitle: 'Rooms and huts',
        onTap: () => onOpen(_stay),
      ),
      GuestQuickAction(
        icon: Icons.restaurant_outlined,
        title: 'Dine in',
        subtitle: 'Reserve table',
        onTap: () => onOpen(_dine),
      ),
      GuestQuickAction(
        icon: Icons.account_balance_outlined,
        title: 'Museum',
        subtitle: 'Cultural tour',
        onTap: () => onOpen(_museum),
      ),
      GuestQuickAction(
        icon: Icons.spa_outlined,
        title: 'Spa',
        subtitle: 'Massage and steam',
        onTap: () => _openPlaceholder(context, 'Spa'),
      ),
      GuestQuickAction(
        icon: Icons.pool_outlined,
        title: 'Pool',
        subtitle: 'Swim and relax',
        onTap: () => _openPlaceholder(context, 'Pool'),
      ),
    ];

    // Step 2: pair the actions into columns of two, each card the same fixed size.
    final columns = <Widget>[];
    for (var i = 0; i < actions.length; i += 2) {
      columns.add(GuestQuickActionColumn(children: actions.skip(i).take(2).toList()));
    }

    // Step 3: lay the columns out in one horizontal, swipeable strip. No auto-scroll is used.
    return SizedBox(
      height: IgongoQuickAction.height * 2 + IgongoSpace.xs,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
        itemCount: columns.length,
        separatorBuilder: (_, _) => const SizedBox(width: IgongoSpace.xs),
        itemBuilder: (_, i) => columns[i],
      ),
    );
  }
}
