// The round red avatar with the person's initials, a thin gold ring, and a
// small gold sparkle badge on its bottom-right edge.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/initials.dart';
import '../../../../shared/theme/theme.dart';

/// A red avatar showing [name]'s initials, or a person icon if there is no name.
class ProfileAvatar extends StatelessWidget {
  /// Creates the avatar for [name].
  const ProfileAvatar({super.key, required this.name, this.size = 48});

  /// The person's name; the initials come from it.
  final String name;

  /// Width and height of the red disc in logical pixels (the badge sits on its edge).
  final double size;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final initials = initialsOf(name);
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Step 1: the red disc with a soft gold ring; solid red in both modes.
          Container(
            width: size,
            height: size,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: p.primary,
              shape: BoxShape.circle,
              border: Border.all(color: p.accent.withValues(alpha: 0.4), width: 2),
            ),
            child: initials.isEmpty
                ? Icon(Icons.person, color: p.onPrimary, size: size * 0.5)
                : Text(
                    initials,
                    style: context.text.titleLarge?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700),
                  ),
          ),
          // Step 2: the gold sparkle badge on the bottom-right edge, with a white rim.
          Positioned(
            right: -2,
            bottom: -2,
            child: Container(
              width: 16,
              height: 16,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: p.accent,
                shape: BoxShape.circle,
                border: Border.all(color: p.surface),
              ),
              child: Icon(Icons.auto_awesome, size: 9, color: p.onPrimary),
            ),
          ),
        ],
      ),
    );
  }
}
