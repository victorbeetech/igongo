// The quick actions under the hero card. The super admin sets their words, icons and
// screens in the home settings, and switches each one on or off. They sit in rows of
// two that scroll sideways by swiping. Every card is the same size, taken from the
// design tokens. There is no automatic scrolling. [onOpen] opens the screen for an area.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/home_content/domain/home_quick_action.dart';
import '../../../../../shared/home_content/presentation/home_icons.dart';
import 'guest_quick_action.dart';
import 'guest_quick_action_column.dart';
import 'guest_service_placeholder_page.dart';

/// The grid of quick-action cards, two rows high, swiped sideways.
class GuestQuickActions extends StatelessWidget {
  /// Creates the grid from the actions the super admin switched on; [onOpen] receives the screen ID to open.
  const GuestQuickActions({super.key, required this.items, required this.onOpen});

  /// The actions to show, in order.
  final List<HomeQuickAction> items;

  /// Called with the screen ID of the tapped action.
  final void Function(String screenId) onOpen;

  /// Opens the coming-soon page for a service that has no screen yet.
  static void _openPlaceholder(BuildContext context, String title) {
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => GuestServicePlaceholderPage(title: title)));
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: one card per action, in the order set. A blank screen ID opens the coming-soon page.
    final actions = <Widget>[
      for (final a in items)
        GuestQuickAction(
          icon: homeIconFor(a.icon),
          title: a.title,
          subtitle: a.subtitle,
          onTap: () => a.screenId.isEmpty ? _openPlaceholder(context, a.title) : onOpen(a.screenId),
        ),
    ];

    // Step 2: pair the actions into columns of two, filled down each column first,
    // so each column holds two cards, one over the other, and every card is the same fixed size.
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
