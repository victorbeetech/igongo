// The form layout: labelled fields and a submit button. Fields come from the
// inventory when it names them, or from the module's sample fields.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../mock/sample_text.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/field/igongo_field.dart';
import '../parts/dialog_buttons.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';

/// A form that collects details and submits them.
class FormLayout extends StatelessWidget {
  /// Creates the form for [screen].
  const FormLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    // Step 1: the field labels for this form.
    final fields = screen.spec.fields.isNotEmpty ? screen.spec.fields : screen.module.mock.fields;
    // Step 2: the submit button goes to the next screen, or to home when there is none.
    final next = screen.spec.opens.isEmpty ? null : screen.spec.opens.first;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            spacing: IgongoSpace.md,
            children: [
              for (final label in fields)
                IgongoField(
                  label: label,
                  hint: SampleText.hintFor(label),
                  obscure: label.toLowerCase().contains('password'),
                ),
              const SizedBox(height: IgongoSpace.sm),
              IgongoButton(
                label: next == null ? 'Submit' : 'Continue',
                expand: true,
                onPressed: next == null ? null : () => screen.open(next),
              ),
              // Further choices this form leads to, as quieter buttons.
              for (final id in screen.spec.opens.skip(1))
                IgongoButton(label: screen.nameOf(id), variant: ButtonVariant.text, onPressed: () => screen.open(id)),
            ],
          ),
        ),
        DialogButtons(screen),
      ],
    );
  }
}
