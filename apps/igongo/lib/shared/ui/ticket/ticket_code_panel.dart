// The white, rounded panel that holds a scannable code on a ticket (a QR code or
// a barcode). It is always white with dark ink, in light and dark mode, so the
// code scans the same way in both.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// A white panel around [child], the code and its caption.
class TicketCodePanel extends StatelessWidget {
  /// Creates the panel around [child].
  const TicketCodePanel({super.key, required this.child});

  /// What the panel holds: a QR code or a barcode, with any caption under it.
  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
    // Step 1: a white quiet zone around the code, so a scanner can find its edges.
    padding: const EdgeInsets.all(IgongoSpace.md),
    // Step 2: the same white, the same corner radius for every code on a ticket.
    decoration: BoxDecoration(
      color: IgongoColorsLight.surface,
      borderRadius: BorderRadius.circular(IgongoRadius.sm),
    ),
    // Step 3: the code itself.
    child: child,
  );
}
