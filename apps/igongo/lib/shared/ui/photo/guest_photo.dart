// A guest photo frame. The picture is either a bundled asset or a web address the
// super admin set. When there is no picture yet, or it cannot be loaded, it shows a
// placeholder of the same shape: a soft brand gradient with a picture icon.
// Screens never draw their own placeholder.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A photo that fills its parent, or a placeholder of the same shape.
class GuestPhoto extends StatelessWidget {
  /// Creates the photo frame. [imageUrl] (a web address) wins over [asset] when both are set.
  const GuestPhoto({super.key, this.asset, this.imageUrl, this.label, this.fit = BoxFit.cover});

  /// The asset path of the photo, or null while the owner has not supplied one.
  final String? asset;

  /// The web address of a photo the super admin set, or null or "" for none.
  final String? imageUrl;

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
    // Step 2: a web photo when one is set, else the bundled asset; a failed load falls back to the placeholder.
    final url = imageUrl;
    final Widget content;
    if (url != null && url.isNotEmpty) {
      // While the web photo loads, the placeholder shows, so the frame never sits empty.
      content = Image.network(
        url,
        fit: fit,
        loadingBuilder: (context, child, progress) => progress == null ? child : placeholder,
        errorBuilder: (context, error, stack) => placeholder,
      );
    } else {
      content = asset == null
          ? placeholder
          : Image.asset(asset!, fit: fit, errorBuilder: (context, error, stack) => placeholder);
    }
    return Semantics(label: label, image: true, excludeSemantics: label == null, child: content);
  }
}
