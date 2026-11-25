// Toasts: the short message at the bottom after an action, such as "Saved".

import 'package:material_ui/material_ui.dart';

/// Shows a short toast with [message], and an optional [action] such as Undo.
void showIgongoToast(BuildContext context, String message, {String? action, VoidCallback? onAction}) {
  // Step 1: clear any toast still showing, so they never stack up.
  final messenger = ScaffoldMessenger.of(context)..hideCurrentSnackBar();
  // Step 2: show the new one; its look comes from the theme.
  messenger.showSnackBar(
    SnackBar(
      content: Text(message),
      action: action == null ? null : SnackBarAction(label: action, onPressed: onAction ?? () {}),
    ),
  );
}
