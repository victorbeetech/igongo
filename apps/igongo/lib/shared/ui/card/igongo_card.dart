// The one card used on every screen: a bordered surface with padding, which
// can be tapped.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

/// A bordered surface for grouping content.
class IgongoCard extends StatelessWidget {
  /// Creates a card around [child]. Give [onTap] to make it tappable.
  const IgongoCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(IgongoSpace.md),
    this.color,
  });

  /// The content.
  final Widget child;

  /// What happens on tap, if anything.
  final VoidCallback? onTap;

  /// The space inside the card.
  final EdgeInsetsGeometry padding;

  /// A fill other than the surface colour, such as the primary container.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    // The card clips the ink so the tap ripple keeps the rounded corners.
    return Card(
      color: color,
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}
