// The WhatsApp icon: a green speech bubble with a phone inside. The green is part of
// the SVG itself (WhatsApp's brand colour), so the icon is not tinted by the app theme.

import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

/// The WhatsApp icon, drawn from the SVG in assets/images in its own green.
class WhatsappIcon extends StatelessWidget {
  /// Creates the icon. [size] is the width and height in logical pixels.
  const WhatsappIcon({this.size = 24, super.key});

  /// Path of the SVG asset (one place to change it).
  static const String assetPath = 'assets/images/whatsapp_logo.svg';

  /// Width and height of the icon, in logical pixels.
  final double size;

  @override
  Widget build(BuildContext context) {
    // Step 1: draw the SVG at the requested size, in the colours the file holds.
    return SvgPicture.asset(assetPath, width: size, height: size, semanticsLabel: 'WhatsApp');
  }
}
