// The app's own "Allow notifications" explainer, shown once before the
// phone's question. It uses the approved shared dialog (the D00-06 permission
// pattern), so it looks like every other confirmation in the app.

import 'dart:async';

import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/dialogs/igongo_dialog.dart';

/// Shows the explainer and completes with true if the person tapped Confirm.
Future<bool> explainPushPermission(BuildContext context) async {
  final answer = Completer<bool>();
  await showDialog<void>(
    context: context,
    builder: (_) => IgongoDialog(dialog: pushPermissionDialog, onConfirm: () => answer.complete(true)),
  );
  // Cancel, back or a tap outside all mean "not now".
  if (!answer.isCompleted) answer.complete(false);
  return answer.future;
}

/// The explainer's wording.
const pushPermissionDialog = DialogSpec(
  id: 'D10-push',
  name: 'Allow notifications',
  purpose: 'Get alerts for your tasks, orders, bookings and messages. You can change this at any time in Settings.',
  slug: 'allow-notifications',
  tone: DialogTone.confirm,
);
