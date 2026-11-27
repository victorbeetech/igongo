// A cream card with a soft shadow and no border, as on the Bookings home
// reference. It can be tapped; the ink ripple keeps the rounded corners.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A rounded cream surface with a soft shadow.
class SoftCard extends StatelessWidget {
  /// Creates a card around [child]; give [onTap] to make it tappable.
  const SoftCard({super.key, required this.child, this.onTap, this.padding = EdgeInsets.zero});

  /// The content.
  final Widget child;

  /// What happens on tap, if anything.
  final VoidCallback? onTap;

  /// The space inside the card.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // A little rounder than the standard card, like the reference (the token plus 4).
    final radius = BorderRadius.circular(IgongoRadius.lg + 4);
    return DecoratedBox(
      // Step 1: the soft shadow, low and wide, in the text colour at a few percent.
      decoration: BoxDecoration(
        borderRadius: radius,
        boxShadow: [BoxShadow(color: p.text.withValues(alpha: 0.08), blurRadius: 14, offset: const Offset(0, 4))],
      ),
      // Step 2: the surface itself, with the ripple clipped to the corners.
      child: Material(
        color: p.warmCard,
        borderRadius: radius,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}
