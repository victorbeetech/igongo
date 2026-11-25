// The one bottom sheet used for every choice: print, share, assign, edit.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../catalog/catalog.dart';
import '../mock/sample_text.dart';
import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';
import '../ui/field/igongo_field.dart';

/// A bottom sheet for [dialog], with two sample fields and Done.
class IgongoSheet extends StatelessWidget {
  /// Creates the sheet. [fields] are the module's sample field labels.
  const IgongoSheet({super.key, required this.dialog, required this.fields, required this.onConfirm});

  /// The dialog from the inventory.
  final DialogSpec dialog;

  /// Field labels to show.
  final List<String> fields;

  /// What Done does after the sheet closes.
  final VoidCallback onConfirm;

  @override
  Widget build(BuildContext context) => Padding(
    // Lift the sheet above the keyboard when a field is focused.
    padding: EdgeInsets.fromLTRB(
      IgongoSpace.lg,
      0,
      IgongoSpace.lg,
      IgongoSpace.lg + MediaQuery.viewInsetsOf(context).bottom,
    ),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.md,
      children: [
        Text(dialog.name, style: context.text.titleMedium),
        Text(dialog.purpose, style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted)),
        for (final f in fields.take(2)) IgongoField(label: f, hint: SampleText.hintFor(f)),
        IgongoButton(
          label: 'Done',
          expand: true,
          onPressed: () {
            Navigator.pop(context);
            onConfirm();
          },
        ),
      ],
    ),
  );
}
