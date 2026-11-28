// The message shown when an Alerts inbox change fails. Shared by every alert action.

import 'package:material_ui/material_ui.dart';

/// Shows a snackbar saying the alerts could not be changed. The alerts stay as they were.
void showInboxFailure(BuildContext context) {
  // Step 1: a short message at the bottom of the screen, so the person knows to try again.
  ScaffoldMessenger.of(context).showSnackBar(
    const SnackBar(content: Text('We could not update your alerts. Try again.')),
  );
}
