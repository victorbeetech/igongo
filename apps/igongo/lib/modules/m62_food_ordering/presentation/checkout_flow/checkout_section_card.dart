// A white rounded card with a thin warm border: the container for every
// block on the checkout and tracking screens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A surface card holding [child], padded and bordered from the theme tokens.
class CheckoutSectionCard extends StatelessWidget {
  /// Creates the card around [child].
  const CheckoutSectionCard({super.key, required this.child, this.padding = const EdgeInsets.all(IgongoSpace.lg)});

  /// The content inside the card.
  final Widget child;

  /// The inner padding of the card.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: a Material surface (so list tiles inside paint their ink here),
    // with the rounded 1px border in the theme's border colour.
    return Material(
      color: palette.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        side: BorderSide(color: palette.border),
      ),
      child: Padding(padding: padding, child: child),
    );
  }
}
