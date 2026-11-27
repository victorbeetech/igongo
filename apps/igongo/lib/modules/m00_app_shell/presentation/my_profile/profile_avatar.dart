// The round red avatar with the person's initials, with a soft ring around it.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/initials.dart';
import '../../../../shared/theme/theme.dart';

/// A large red avatar showing [name]'s initials, or a person icon if there is no name.
class ProfileAvatar extends StatelessWidget {
  /// Creates the avatar for [name].
  const ProfileAvatar({super.key, required this.name, this.size = 72});

  /// The person's name; the initials come from it.
  final String name;

  /// Width and height of the red disc in logical pixels.
  final double size;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final initials = initialsOf(name);
    return Container(
      // Step 1: the soft ring sits outside the red disc.
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: p.primaryContainer, width: 2)),
      child: Container(
        width: size,
        height: size,
        alignment: Alignment.center,
        // Step 2: solid Igongo red in both modes, with cream-white initials.
        decoration: BoxDecoration(color: p.primary, shape: BoxShape.circle),
        child: initials.isEmpty
            ? Icon(Icons.person, color: p.onPrimary, size: size * 0.5)
            : Text(initials, style: context.text.headlineSmall?.copyWith(color: p.onPrimary, fontWeight: FontWeight.w700)),
      ),
    );
  }
}
