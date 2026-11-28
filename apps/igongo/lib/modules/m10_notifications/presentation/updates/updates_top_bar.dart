// The top row of the Updates screen: the Igongo logo on the left, then the bell
// and the profile photo. It is drawn here because this screen has no app bar.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/logo/igongo_logo.dart';

/// The logo, the bell and the profile photo in one row.
class UpdatesTopBar extends StatelessWidget {
  /// Creates the top row.
  const UpdatesTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      // Step 1: the row keeps the screen's side gutter and sits under the status bar.
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.sm),
      child: Row(
        children: [
          // Step 2: the logo in the brand kit's colourway for the mode (never redrawn).
          const IgongoLogo(shape: LogoShape.horizontal, height: 36),
          const Spacer(),
          // Step 3: the bell. Its action is wired with the alerts feed.
          IconButton(
            tooltip: 'Notifications',
            onPressed: () {},
            icon: Icon(Icons.notifications_none, color: p.primary),
          ),
          const SizedBox(width: IgongoSpace.xs),
          // Step 4: the profile photo, a placeholder until the guest's photo is read.
          const _ProfileAvatar(),
        ],
      ),
    );
  }
}

/// The round profile photo slot, drawn as a person icon until a photo is set.
class _ProfileAvatar extends StatelessWidget {
  /// Creates the avatar.
  const _ProfileAvatar();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      width: 32,
      height: 32,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
      child: Icon(Icons.person, size: 18, color: p.onPrimaryContainer),
    );
  }
}
