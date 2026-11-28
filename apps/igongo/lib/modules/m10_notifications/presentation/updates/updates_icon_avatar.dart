// The round icon at the start of each update card, in a tint for its category.

import 'package:material_ui/material_ui.dart';

/// A 40-pixel round disc with one icon in the middle.
class UpdatesIconAvatar extends StatelessWidget {
  /// Creates the disc for [icon].
  const UpdatesIconAvatar({super.key, required this.icon, required this.background, required this.foreground});

  /// The icon drawn in the middle.
  final IconData icon;

  /// The disc's fill, a soft tint of the category colour.
  final Color background;

  /// The icon's colour.
  final Color foreground;

  @override
  Widget build(BuildContext context) => Container(
    // The disc is 40 pixels, the size of the reference design's avatar.
    width: 40,
    height: 40,
    alignment: Alignment.center,
    decoration: BoxDecoration(color: background, shape: BoxShape.circle),
    child: Icon(icon, size: 20, color: foreground),
  );
}
