// The scanner layout: the NFC and QR target, typing the number by hand, and
// what happens after a tap.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/scan/scan_frame.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';

/// Waits for a card, wristband or QR code.
class ScannerLayout extends StatelessWidget {
  /// Creates the scanner for [screen].
  const ScannerLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    // In the prototype, "Simulate a tap" stands in for a real card and goes to the next screen.
    final next = screen.links.isEmpty ? null : screen.links.first;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        const Padding(
          padding: EdgeInsets.symmetric(vertical: IgongoSpace.xl),
          child: ScanFrame(),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Column(
            spacing: IgongoSpace.sm,
            children: [
              IgongoButton(
                label: 'Simulate a tap',
                icon: Icons.nfc,
                expand: true,
                onPressed: next == null ? null : () => screen.open(next),
              ),
              IgongoButton(
                label: 'Enter number by hand',
                variant: ButtonVariant.secondary,
                expand: true,
                onPressed: next == null ? null : () => screen.open(next),
              ),
            ],
          ),
        ),
        LinkRows(screen, title: 'After the tap'),
        DialogButtons(screen),
      ],
    );
  }
}
