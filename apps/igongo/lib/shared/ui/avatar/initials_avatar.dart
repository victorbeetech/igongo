// A round avatar with a person's or record's initials, used until photos
// exist. Its colour is fixed per name so the same person always looks the same.

import 'package:material_ui/material_ui.dart';

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
    // Step 1: the first letters of the first two words.
    final words = name.split(RegExp(r'[\s·]+')).where((w) => w.isNotEmpty && RegExp(r'[A-Za-z]').hasMatch(w[0]));
    final initials = words.take(2).map((w) => w[0].toUpperCase()).join();
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
