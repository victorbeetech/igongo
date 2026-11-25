// Showcase: the logo shapes and the default staff card, from the brand kit.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/ui/logo/igongo_logo.dart';
import '../../../shared/ui/staff_card/staff_card_view.dart';
import '../showcase_section.dart';

/// The logo in each shape, and the black portrait staff card.
class BrandSection extends StatelessWidget {
  /// Creates the section.
  const BrandSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ShowcaseSection(
      title: 'Brand',
      children: [
        // Every logo shape, as the screens use them; it swaps colourway with the theme.
        Wrap(
          spacing: IgongoSpace.xl,
          runSpacing: IgongoSpace.md,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [for (final shape in LogoShape.values) IgongoLogo(shape: shape, height: 44)],
        ),
        const Center(child: StaffCardView(width: 180)),
      ],
    );
  }
}
