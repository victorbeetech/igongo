// The photo area used by dish cards, restaurant cards, the menu slideshow and
// the dish page. Shows the photo from the server, or a neutral placeholder
// when there is none or it fails to load.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A photo that fills its parent, with a placeholder icon when missing.
class PhotoPlaceholder extends StatelessWidget {
  /// Creates the photo area; [url] is the photo, [icon] shows when there is none.
  const PhotoPlaceholder({super.key, this.url, this.icon = Icons.restaurant_menu});

  /// The photo's address, or null for none.
  final String? url;

  /// The icon shown in the placeholder.
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    // Step 1: the placeholder, in the theme's surface colour so light and dark both read.
    final fallback = ColoredBox(
      color: context.palette.surfaceAlt,
      child: Center(child: Icon(icon, size: 40, color: context.palette.textMuted)),
    );
    // Step 2: no address, so the placeholder.
    final address = url;
    if (address == null || address.isEmpty) return fallback;
    // Step 3: the photo fills the area; a failed load falls back to the placeholder.
    return Image.network(
      address,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      errorBuilder: (_, _, _) => fallback,
    );
  }
}
