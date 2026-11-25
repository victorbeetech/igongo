// The one dialog used for every confirmation, danger question and warning.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../catalog/catalog.dart';
import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';
import 'dialog_tone_style.dart';

/// A centred dialog for [dialog]. Confirm calls [onConfirm]; Cancel just closes.
class IgongoDialog extends StatelessWidget {
  /// Creates the dialog.
  const IgongoDialog({super.key, required this.dialog, required this.onConfirm});

  /// The dialog from the inventory.
  final DialogSpec dialog;

  /// What Confirm does after the dialog closes.
  final VoidCallback onConfirm;

  @override
  Widget build(BuildContext context) {
    final style = DialogToneStyle.of(context, dialog.tone);
    return AlertDialog(
      icon: Icon(style.icon, color: style.colour, size: 32),
      title: Text(dialog.name, textAlign: TextAlign.center),
      content: Text(
        dialog.purpose,
        textAlign: TextAlign.center,
        style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted),
      ),
      actionsAlignment: MainAxisAlignment.center,
      actionsOverflowButtonSpacing: IgongoSpace.sm,
      actions: [
        // A warning only needs OK; the others can be cancelled.
        if (dialog.tone != DialogTone.warning)
          IgongoButton(label: 'Cancel', variant: ButtonVariant.text, onPressed: () => Navigator.pop(context)),
        IgongoButton(
          label: style.confirm,
          variant: style.variant,
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    );
  }
}
