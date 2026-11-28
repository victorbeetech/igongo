// The Updates screen (S00-28): the signed-in guest's alerts, read live from the
// API. It has a red app bar titled "Updates" with an automatic Back arrow when
// pushed, and "Mark all as read" on the right. Nothing on it is sample data.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../shared/catalog/screen_context.dart';
import '../../../../shared/layout/igongo_scaffold.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../application/inbox_providers.dart';
import '../../domain/inbox_page.dart';
import '../inbox/inbox_view.dart';
import '../inbox/mark_all_read_button.dart';

/// The Updates screen for [screen]. It reuses the Alerts inbox list, so both show the same live data.
class UpdatesScreen extends ConsumerWidget {
  /// Creates the screen.
  const UpdatesScreen(this.screen, {super.key});

  /// The screen's context: its name, its design and its links.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Step 1: the live inbox. Its unread count decides whether "Mark all as read" is enabled.
    final inbox = ref.watch(inboxProvider);
    final unread = inbox.value?.unreadCount ?? 0;
    return IgongoScaffold(
      // Step 2: the app bar title. Its Back arrow comes from the app bar when the screen is pushed.
      title: 'Updates',
      // Step 3: "Mark all as read" sits on the right of the app bar and reloads the list when done.
      actions: [
        MarkAllReadButton(enabled: unread > 0, onChanged: () => ref.invalidate(inboxProvider)),
      ],
      // Step 4: the list, with the designed loading, error and sign-in states from LiveView.
      body: LiveView<InboxPage>(
        screenName: screen.spec.name,
        value: inbox,
        sample: (_) => screenLayout(screen),
        onRetry: () => ref.invalidate(inboxProvider),
        builder: (context, page, _) => InboxView(
          page: page,
          onChanged: () => ref.invalidate(inboxProvider),
          // The app bar already holds the mark-all action, so the body bar stays hidden.
          showUnreadBar: false,
        ),
      ),
    );
  }
}
