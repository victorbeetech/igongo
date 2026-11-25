// The Igongo logo from the brand kit, in the right colourway for the
// background: colour on light, reversed on dark, white on Igongo red.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:igongo_brand/igongo_brand.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// Which logo layout to show.
enum LogoShape {
  /// The mark alone: spiral, horns and cup.
  mark,

  /// The mark with the name beside it.
  horizontal,

  /// The mark with the name below it.
  stacked,
}

/// Shows the Igongo logo. Never redraws or recolours it (brand rule 2).
class IgongoLogo extends StatelessWidget {
  /// Creates a logo of the given [shape] and [height]. Set [onRed] on Igongo red.
  const IgongoLogo({super.key, this.shape = LogoShape.mark, this.height = 40, this.onRed = false});

  /// Which layout to show.
  final LogoShape shape;

  /// The logo height in logical pixels.
  final double height;

  /// Whether the logo sits on Igongo red, which needs the white colourway.
  final bool onRed;

  @override
  Widget build(BuildContext context) {
    // Step 1: pick the colourway for the background, as the brand rules say.
    final dark = context.isDark;
    final file = switch (shape) {
      LogoShape.mark => onRed ? BrandAssets.markWhite : (dark ? BrandAssets.markReversed : BrandAssets.markColor),
      LogoShape.horizontal => dark || onRed ? BrandAssets.horizontalReversed : BrandAssets.horizontalColor,
      LogoShape.stacked => dark || onRed ? BrandAssets.stackedReversed : BrandAssets.stackedColor,
    };
    // Step 2: draw the kit's own SVG file, labelled for screen readers.
    return SvgPicture.asset(file, package: BrandAssets.package, height: height, semanticsLabel: 'Igongo');
  }
}
