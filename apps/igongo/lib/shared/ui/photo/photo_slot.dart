// A photo with a plain placeholder: shows the picture when its address or asset path is
// set, otherwise a tinted box. Never a stock photo (the hotel sends its own).

import 'package:material_ui/material_ui.dart';

/// One photo, or a plain box while the file is missing.
class PhotoSlot extends StatelessWidget {
  /// Creates a slot of [width] by [height]; [asset] is the picture's path, if any.
  const PhotoSlot({
    super.key,
    required this.width,
    required this.height,
    this.asset,
    this.alignment = Alignment.center,
    this.icon = Icons.image_outlined,
  });

  /// The slot's size in logical pixels.
  final double width;

  /// The slot's height in logical pixels.
  final double height;

  /// The photo's https address or asset path, or null for the placeholder.
  final String? asset;

  /// Which part of the photo stays in view when it is cropped to the slot.
  final Alignment alignment;

  /// The icon on the placeholder.
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    // The placeholder, also used if the file cannot be read.
    final placeholder = ColoredBox(
      color: scheme.primaryContainer,
      child: Center(child: Icon(icon, color: scheme.primary.withValues(alpha: 0.6))),
    );
    return SizedBox(
      width: width,
      height: height,
      child: asset == null
          ? placeholder
          : asset!.startsWith('http')
          ? Image.network(
              asset!,
              fit: BoxFit.cover,
              alignment: alignment,
              excludeFromSemantics: true,
              errorBuilder: (_, _, _) => placeholder,
            )
          : Image.asset(
              asset!,
              fit: BoxFit.cover,
              alignment: alignment,
              excludeFromSemantics: true,
              errorBuilder: (_, _, _) => placeholder,
            ),
    );
  }
}
