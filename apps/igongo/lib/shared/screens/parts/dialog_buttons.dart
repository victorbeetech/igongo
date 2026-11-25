// The buttons that open a screen's dialogs: confirmations, sheets and warnings.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/button/igongo_button.dart';

/// One button per dialog the screen opens.
class DialogButtons extends StatelessWidget {
  /// Creates the buttons for [screen].
  const DialogButtons(this.screen, {super.key});

  /// The screen whose dialogs to offer.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    if (screen.spec.dialogs.isEmpty) return const SizedBox.shrink();
    // Buttons wrap onto new lines at large text sizes instead of overflowing.
    return Padding(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.sm,
        children: [
          for (final id in screen.spec.dialogs)
            IgongoButton(label: screen.nameOf(id), variant: ButtonVariant.secondary, onPressed: () => screen.open(id)),
        ],
      ),
    );
  }
}
