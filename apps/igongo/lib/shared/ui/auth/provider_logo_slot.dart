// The logo on the Google and Apple sign-in buttons. The two logos are the
// vector marks from the approved design, kept as SVG files in assets/images.
// The Apple mark takes the theme's text colour, so it reads in light and dark.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A small provider logo, drawn from its SVG file at the size the design uses.
class ProviderLogoSlot extends StatelessWidget {
  /// Creates the logo for [method], the server's key (`google` or `apple`).
  const ProviderLogoSlot({super.key, required this.method});

  /// The server's key for the provider; picks the logo file.
  final String method;

  /// The logo files by provider key.
  static const _files = {'google': 'assets/images/google_logo.svg', 'apple': 'assets/images/apple_logo.svg'};

  @override
  Widget build(BuildContext context) {
    // Step 1: the Apple mark is one colour, so it takes the theme's text colour; Google keeps its own colours.
    final tint = method == 'apple' ? ColorFilter.mode(context.palette.text, BlendMode.srcIn) : null;
    // Step 2: the logo at the design's 16 pixels. Excluded from screen readers, because the button's label already says the name.
    return ExcludeSemantics(
      child: SvgPicture.asset(_files[method] ?? _files['google']!, width: 16, height: 16, colorFilter: tint),
    );
  }
}
