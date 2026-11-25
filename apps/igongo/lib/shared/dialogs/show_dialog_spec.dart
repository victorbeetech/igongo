// Opens any dialog of the inventory in the right form: a bottom sheet for
// choices, a centred dialog for everything else. After Confirm it opens the
// dialog's next screen, or shows a toast when it has none.

import 'package:material_ui/material_ui.dart';

import '../catalog/catalog.dart';
import '../ui/toast/igongo_toast.dart';
import 'igongo_dialog.dart';
import 'igongo_sheet.dart';

/// Shows [dialog] over the current screen. [open] opens a screen by number.
Future<void> showDialogSpec(
  BuildContext context,
  DialogSpec dialog,
  List<String> fields,
  void Function(String id) open,
) {
  // Step 1: what happens after Confirm: the next screen, or a toast to say it is done.
  void confirm() {
    if (dialog.opens.isNotEmpty) {
      open(dialog.opens.first);
    } else if (context.mounted) {
      showIgongoToast(context, '${dialog.name}: done');
    }
  }

  // Step 2: a sheet for choices, a dialog for the rest.
  if (dialog.tone == DialogTone.sheet) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => IgongoSheet(dialog: dialog, fields: fields, onConfirm: confirm),
    );
  }
  return showDialog<void>(
    context: context,
    builder: (_) => IgongoDialog(dialog: dialog, onConfirm: confirm),
  );
}
