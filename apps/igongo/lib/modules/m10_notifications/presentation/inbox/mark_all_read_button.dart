// The "Mark all as read" action of the Alerts inbox. It is used in the Updates app
// bar and in the inbox body, so both do the same real change on the server.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../application/inbox_providers.dart';
import 'inbox_failure.dart';

/// The text button that marks every unread alert of the person read.
class MarkAllReadButton extends ConsumerWidget {
  /// Creates the button. It is greyed out while [enabled] is false.
  const MarkAllReadButton({super.key, required this.enabled, required this.onChanged});

  /// False when nothing is unread, so there is nothing to mark.
  final bool enabled;

  /// Called after the API has marked the alerts, so the list reloads.
  final VoidCallback onChanged;

  @override
  Widget build(BuildContext context, WidgetRef ref) => TextButton(
    // Step 1: with nothing unread the button is disabled (null turns it off).
    onPressed: enabled ? () => _markAll(context, ref) : null,
    child: const Text('Mark all as read'),
  );

  /// Asks the API to mark every alert read, then reloads. A failure shows a message instead.
  Future<void> _markAll(BuildContext context, WidgetRef ref) async {
    try {
      // Step 2: one call marks all of the signed-in person's alerts read on the server.
      await ref.read(inboxApiProvider).markAllRead();
      onChanged();
    } on Exception {
      // Step 3: a failed call leaves the alerts unchanged and tells the person.
      if (context.mounted) showInboxFailure(context);
    }
  }
}
