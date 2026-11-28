// The tear line between the parts of a ticket: two half-circle notches at the
// edges, joined by a dashed line. The notches take the page colour so they look cut out.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/ticket/dashed_divider.dart';

/// A dashed tear line with a notch cut at each side.
class TicketPerforation extends StatelessWidget {
  /// Creates the tear line.
  const TicketPerforation({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    const notch = IgongoSpace.xl;
    return SizedBox(
      height: IgongoSpace.xl,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // The dashed line runs between the notches.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: notch),
            child: DashedDivider(color: p.outline),
          ),
          // Left notch, cut into the card edge.
          Positioned(
            left: -notch / 2,
            child: _Notch(color: p.background),
          ),
          // Right notch, cut into the card edge.
          Positioned(
            right: -notch / 2,
            child: _Notch(color: p.background),
          ),
        ],
      ),
    );
  }
}

/// One round notch that matches the page behind the ticket.
class _Notch extends StatelessWidget {
  /// Creates a notch painted in [color].
  const _Notch({required this.color});

  /// The page colour behind the ticket.
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
    width: IgongoSpace.xl,
    height: IgongoSpace.xl,
    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
  );
}
