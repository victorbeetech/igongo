// The round icon at the top of an account dialog, with a soft ring around it.

import 'package:material_ui/material_ui.dart';

/// A round badge with [icon] in [iconColour] on a [background] disc.
class DialogIconBadge extends StatelessWidget {
  /// Creates the badge.
  const DialogIconBadge({
    super.key,
    required this.icon,
    required this.iconColour,
    required this.background,
    required this.ring,
  });

  /// The icon in the middle.
  final IconData icon;

  /// The icon colour.
  final Color iconColour;

  /// The disc behind the icon.
  final Color background;

  /// The soft ring around the disc.
  final Color ring;

  @override
  Widget build(BuildContext context) {
    // Step 1: the outer ring, then the disc with the icon.
    return Container(
      width: 72,
      height: 72,
      alignment: Alignment.center,
      decoration: BoxDecoration(shape: BoxShape.circle, color: ring),
      child: Container(
        width: 56,
        height: 56,
        alignment: Alignment.center,
        decoration: BoxDecoration(shape: BoxShape.circle, color: background),
        child: Icon(icon, color: iconColour, size: 28),
      ),
    );
  }
}
