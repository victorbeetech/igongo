// The top bar of Edit Profile: a back arrow, the screen title, and the person's
// small avatar on the right. It replaces the app bar on these screens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/avatar/initials_avatar.dart';

/// The Edit Profile top bar.
class EditProfileTopBar extends StatelessWidget {
  /// Creates the bar. [name] fills the small avatar.
  const EditProfileTopBar({super.key, required this.name});

  /// The person's name, for the small avatar.
  final String name;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SafeArea(
      bottom: false,
      child: Container(
        height: 64,
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm),
        decoration: BoxDecoration(color: p.background, border: Border(bottom: BorderSide(color: p.border))),
        child: Row(
          children: [
            // Step 1: the back arrow, a 44 pixel touch target.
            IconButton(
              tooltip: 'Back',
              icon: const Icon(Icons.arrow_back),
              onPressed: () => Navigator.of(context).maybePop(),
            ),
            // Step 2: the title, in the brand face.
            Expanded(child: Text('Edit Profile', style: context.text.displaySmall, overflow: TextOverflow.ellipsis)),
            // Step 3: the small avatar on the right.
            InitialsAvatar(name: name, size: 32),
            const SizedBox(width: IgongoSpace.xs),
          ],
        ),
      ),
    );
  }
}
