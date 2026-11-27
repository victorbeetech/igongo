// The five quick actions under the hero card: Book stay, Dine in, Museum, Spa and Pool,
// all in one row of equal columns. [onOpen] opens the screen for the chosen area.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import 'guest_quick_action.dart';

/// The row of five quick-action cards.
class GuestQuickActions extends StatelessWidget {
  /// Creates the row; [onOpen] receives the screen ID to open.
  const GuestQuickActions({super.key, required this.onOpen});

  /// Called with the screen ID of the tapped action.
  final void Function(String screenId) onOpen;

  /// The screen for room booking (the Rooms list).
  static const _stay = 'S67-01';

  /// The food home, for dining.
  static const _dine = 'S62-01';

  /// The museum's home.
  static const _museum = 'S68-01';

  /// Spa and pool have no screen yet, so their cards do nothing until they are wired.
  static void _placeholder() {}

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
    // Step 1: five equal columns with a small gap between them.
    child: IntrinsicHeight(
      child: Row(
        spacing: IgongoSpace.xs,
        children: [
          Expanded(
            child: GuestQuickAction(
              icon: Icons.hotel_outlined,
              title: 'Book stay',
              subtitle: 'Rooms and huts',
              onTap: () => onOpen(_stay),
            ),
          ),
          Expanded(
            child: GuestQuickAction(
              icon: Icons.restaurant_outlined,
              title: 'Dine in',
              subtitle: 'Reserve table',
              onTap: () => onOpen(_dine),
            ),
          ),
          Expanded(
            child: GuestQuickAction(
              icon: Icons.account_balance_outlined,
              title: 'Museum',
              subtitle: 'Cultural tour',
              onTap: () => onOpen(_museum),
            ),
          ),
          const Expanded(
            child: GuestQuickAction(
              icon: Icons.spa_outlined,
              title: 'Spa',
              subtitle: 'Massage and steam',
              onTap: _placeholder,
            ),
          ),
          const Expanded(
            child: GuestQuickAction(
              icon: Icons.pool_outlined,
              title: 'Pool',
              subtitle: 'Swim and relax',
              onTap: _placeholder,
            ),
          ),
        ],
      ),
    ),
  );
}
