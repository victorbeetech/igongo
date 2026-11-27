// A round avatar with a person's or record's initials, used until photos
// exist. Its colour is fixed per name so the same person always looks the same.

import 'package:material_ui/material_ui.dart';

import '../../format/initials.dart';
import '../../theme/theme.dart';

/// A round avatar showing up to two initials.
class InitialsAvatar extends StatelessWidget {
  /// Creates an avatar for [name].
  const InitialsAvatar({super.key, required this.name, this.size = 36});

  /// The name the initials come from.
  final String name;

  /// Width and height in logical pixels.
  final double size;

  @override
  Widget build(BuildContext context) {
    // Step 1: the initials come from the shared rule.
    final initials = initialsOf(name);
    // Step 2: a soft brand fill with readable text in both modes.
    final p = context.palette;
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
      child: Text(
        initials,
        style: context.text.labelMedium?.copyWith(color: p.onPrimaryContainer, fontWeight: FontWeight.w700),
      ),
    );
  }
}
