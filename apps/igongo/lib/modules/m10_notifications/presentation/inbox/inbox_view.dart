// Draws one page of the Alerts inbox: a "mark all read" bar, then each alert.
// Tapping an alert marks it read and opens its link.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/when.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/message/state_message.dart';
import '../../application/inbox_providers.dart';
import '../../domain/inbox_item.dart';
import '../../domain/inbox_page.dart';
import 'inbox_failure.dart';
import 'mark_all_read_button.dart';

/// Draws [page]. [onChanged] runs after any change so the screen reloads.
class InboxView extends ConsumerWidget {
  /// Creates the view for [page]. [showUnreadBar] false hides the bar when the screen has its own mark-all action.
  const InboxView({super.key, required this.page, required this.onChanged, this.showUnreadBar = true});

  /// The items and unread count to draw.
  final InboxPage page;

  /// Called after an alert is marked read, so the list refreshes.
  final VoidCallback onChanged;

  /// Whether the unread count and its mark-all bar show above the list.
  final bool showUnreadBar;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: nothing has arrived yet, so say what will appear here.
    if (page.items.isEmpty) {
      return const StateMessage(
        icon: Icons.notifications_none,
        title: 'No alerts yet',
        message: 'Order updates, booking news and messages from Igongo will appear here.',
      );
    }
    // Step 2: the list, with the unread bar on top when something is unread.
    return ScreenListView(
      children: [
        if (showUnreadBar && page.unreadCount > 0) _UnreadBar(count: page.unreadCount, onChanged: onChanged),
        for (final item in page.items) _AlertRow(item: item, onChanged: onChanged),
      ],
    );
  }
}

/// The count of unread alerts and the button that marks them all read.
class _UnreadBar extends StatelessWidget {
  /// Creates the bar for [count] unread alerts.
  const _UnreadBar({required this.count, required this.onChanged});

  /// How many alerts are unread.
  final int count;

  /// Called after the mark-all call, so the list refreshes.
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
    child: Row(
      children: [
        Expanded(child: Text('$count unread', style: context.text.titleSmall)),
        MarkAllReadButton(enabled: true, onChanged: onChanged),
      ],
    ),
  );
}

/// One alert: its title, its message and time, and a "New" mark while unread.
class _AlertRow extends ConsumerWidget {
  /// Creates the row for [item].
  const _AlertRow({required this.item, required this.onChanged});

  /// The alert to draw.
  final InboxItem item;

  /// Called after the alert is marked read, so the list refreshes.
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) => IgongoListRow(
    title: item.title,
    subtitle: '${item.body} · ${dayTime(item.createdAt)}',
    status: item.isUnread ? 'New' : null,
    onTap: () async {
      // Step 1: mark it read first, so it shows as read when the guest comes back.
      if (item.isUnread) {
        try {
          await ref.read(inboxApiProvider).markRead(item.id);
          onChanged();
        } on Exception {
          if (context.mounted) showInboxFailure(context);
          return;
        }
      }
      // Step 2: open the screen the alert links to, if it has one.
      final link = item.link;
      if (link != null && context.mounted) await context.push<void>(link);
    },
  );
}
