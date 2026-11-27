// The WhatsApp icon: a speech bubble with a phone inside. It is the one icon
// for every "chat on WhatsApp" action in the app, so it looks the same everywhere.

import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// The WhatsApp icon, drawn from the SVG in assets/images and tinted to [colour].
class WhatsappIcon extends StatelessWidget {
  /// Creates the icon. [size] is the width and height; [colour] tints the drawing.
  const WhatsappIcon({required this.colour, this.size = 24, super.key});

  /// Path of the SVG asset (one place to change it).
  static const String assetPath = 'assets/images/whatsapp_logo.svg';

  /// Width and height of the icon, in logical pixels.
  final double size;

  /// Colour the icon is painted in (the foreground colour of its button).
  final Color colour;

  @override
  Widget build(BuildContext context) {
    // Step 1: draw the SVG at the requested size.
    // Step 2: replace its colour with [colour] so light and dark themes both work.
    return SvgPicture.asset(
      assetPath,
      width: size,
      height: size,
      colorFilter: ColorFilter.mode(colour, BlendMode.srcIn),
      semanticsLabel: 'WhatsApp',
    );
  }
}
