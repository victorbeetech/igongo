// The bell button that opens the Updates screen. Its red dot follows the live
// unread count from the API, so it shows only when something is unread.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/ui/icons/round_icon_button.dart';
import '../../application/inbox_providers.dart';

/// The round bell button with the unread dot. [onPressed] opens the Updates screen.
class InboxBellButton extends ConsumerWidget {
  /// Creates the bell.
  const InboxBellButton({super.key, required this.onPressed});

  /// Called when the bell is tapped.
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the unread count from the live inbox. While it loads or fails, there is no dot.
    final unread = ref.watch(inboxProvider).whenOrNull(data: (page) => page.unreadCount) ?? 0;
    // Step 2: the round bell, with the dot only when something is unread.
    return RoundIconButton(
      icon: Icons.notifications_none,
      tooltip: 'Notifications',
      showDot: unread > 0,
      onPressed: onPressed,
    );
  }
}
