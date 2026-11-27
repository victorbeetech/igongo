// A guest photo frame. When there is no hotel photo yet ([asset] is null, or
// the file cannot be loaded) it shows a placeholder of the same shape: a soft
// brand gradient with a picture icon. Screens never draw their own placeholder.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A photo that fills its parent, or a placeholder of the same shape.
class GuestPhoto extends StatelessWidget {
  /// Creates the photo frame. [asset] is the photo's asset path, or null for the placeholder.
  const GuestPhoto({super.key, this.asset, this.label, this.fit = BoxFit.cover});

  /// The asset path of the photo, or null while the owner has not supplied one.
  final String? asset;

  /// What the photo shows, read by screen readers (optional).
  final String? label;

  /// How the photo fills its frame.
  final BoxFit fit;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the placeholder, a soft gradient in the brand colours with a picture icon.
    final placeholder = DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [palette.primaryContainer, palette.surfaceAlt],
        ),
      ),
      child: Center(child: Icon(Icons.photo_outlined, size: 32, color: palette.primary)),
    );
    // Step 2: the photo when there is one; a failed load falls back to the placeholder.
    final content = asset == null
        ? placeholder
        : Image.asset(asset!, fit: fit, errorBuilder: (context, error, stack) => placeholder);
    return Semantics(label: label, image: true, excludeSemantics: label == null, child: content);
  }
}
