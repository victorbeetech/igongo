// S00-28 Notification inbox: the person's own alerts (orders, bookings, chat,
// sign-in alerts), newest first. Opening an alert marks it read and then opens
// the screen it links to. Signed out, the live view asks the person to sign in.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/screen_context.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../application/inbox_providers.dart';
import '../../domain/inbox_page.dart';
import 'inbox_view.dart';

/// The notification inbox screen for [screen].
class NotificationInboxScreen extends ConsumerWidget {
  /// Creates the screen.
  const NotificationInboxScreen(this.screen, {super.key});

  /// The screen's context: its name, its design and its links.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the live inbox, with the designed loading, error and sign-in states.
    return LiveView<InboxPage>(
      screenName: screen.spec.name,
      value: ref.watch(inboxProvider),
      sample: (_) => screenLayout(screen),
      onRetry: () => ref.invalidate(inboxProvider),
      // Step 2: draw the page. A change reloads the inbox so the unread marks update.
      builder: (context, page, _) => InboxView(page: page, onChanged: () => ref.invalidate(inboxProvider)),
    );
  }
}
