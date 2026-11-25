// Draws one brand kit illustration, tinted from the theme. The drawing's
// lines use `currentColor`, which is set here, so it works in light and dark
// mode; the Igongo spiral inside it stays Igongo red.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';

import 'illustration_kind.dart';

export 'illustration_kind.dart';

/// A state illustration, [width] wide, with its lines in [colour].
class StateIllustration extends StatelessWidget {
  /// Creates the drawing for [kind].
  const StateIllustration(this.kind, {super.key, required this.colour, this.width = 160});

  /// Which drawing.
  final IllustrationKind kind;

  /// The colour of its lines and soft fill.
  final Color colour;

  /// Its width; the height follows (160 by 120).
  final double width;

  @override
  Widget build(BuildContext context) {
    // Decorative: the message under it already says the same in words.
    return ExcludeSemantics(
      child: SvgPicture.asset(
        'packages/igongo_brand/illustrations/${kind.file}.svg',
        width: width,
        height: width * 0.75,
        theme: SvgTheme(currentColor: colour),
      ),
    );
  }
}
