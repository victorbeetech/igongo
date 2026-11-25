// The result layout: the outcome of a step, such as Booking confirmed or
// Account locked, with where to go next.

import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/message/state_message.dart';

/// The outcome of a step.
class ResultLayout extends StatelessWidget {
  /// Creates the result for [screen].
  const ResultLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    // Step 1: good news is green with a tick; everything else is a warning.
    final p = context.palette;
    final good = RegExp(r'(confirmed|placed|sent|result)', caseSensitive: false).hasMatch(screen.spec.name);
    // Step 2: the next steps as buttons, or Done back to home.
    final actions = [
      for (final (i, id) in screen.spec.opens.indexed)
        IgongoButton(
          label: id == 'home' ? 'Done' : screen.nameOf(id),
          variant: i == 0 ? ButtonVariant.primary : ButtonVariant.secondary,
          onPressed: () => screen.open(id),
        ),
      for (final id in screen.spec.dialogs)
        IgongoButton(label: screen.nameOf(id), variant: ButtonVariant.secondary, onPressed: () => screen.open(id)),
      if (screen.spec.opens.isEmpty) IgongoButton(label: 'Back to home', onPressed: () => screen.open('home')),
    ];
    return StateMessage(
      icon: good ? Icons.check_circle_outline : Icons.info_outline,
      colour: good ? p.success : p.warning,
      title: screen.spec.name,
      message: screen.spec.purpose,
      actions: actions,
    );
  }
}
