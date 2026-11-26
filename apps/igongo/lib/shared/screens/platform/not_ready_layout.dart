// Shown to a real person on a screen the app cannot show with live data yet.
// The shared layouts draw sample records for design review only, so a real
// account never sees them: it sees this honest notice instead. The list of
// these screens is in docs/APP-WIRING.md.

import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/message/state_message.dart';

/// Says that [screen] is not connected to live data in the app yet.
class NotReadyLayout extends StatelessWidget {
  /// Creates the notice for [screen].
  const NotReadyLayout(this.screen, {super.key});

  /// The screen that was opened.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) => StateMessage(
    icon: Icons.construction_outlined,
    title: '${screen.spec.name} is not in the app yet',
    message: 'This part of the app is still being connected to the hotel system. Please ask the front desk for help with it.',
    actions: [IgongoButton(label: 'Back to home', onPressed: () => screen.open('home'))],
  );
}
