// Shown in the app when a link leads to a screen that lives on the web
// portal only, such as the super admin's builders.

import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/message/state_message.dart';

/// Explains that this screen is on the web portal, with the address.
class WebOnlyLayout extends StatelessWidget {
  /// Creates the notice for [screen].
  const WebOnlyLayout(this.screen, {super.key});

  /// The web-only screen that was opened.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) => StateMessage(
    icon: Icons.desktop_windows_outlined,
    title: '${screen.spec.name} is on the web portal',
    message:
        '${screen.spec.purpose}.\nOpen portal.igongo.co.ug${screen.spec.route.replaceAll(':id', 'sample')} on a computer.',
    actions: [IgongoButton(label: 'Back to home', onPressed: () => screen.open('home'))],
  );
}
