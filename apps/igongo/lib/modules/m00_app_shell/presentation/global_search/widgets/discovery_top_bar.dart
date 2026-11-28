// The top bar of the search screen: the Igongo mark with the name and
// "Cultural Centre" under it, then the bell and the profile picture on the right.
// Colours and text sizes come from the theme tokens only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/icons/round_icon_button.dart';
import '../../../../../shared/ui/logo/igongo_logo.dart';

/// The search screen's top bar.
class DiscoveryTopBar extends StatelessWidget {
  /// Creates the bar; [onBell] is called when the bell is tapped.
  const DiscoveryTopBar({super.key, required this.onBell});

  /// Called when the bell is tapped.
  final VoidCallback onBell;

  /// The width and height of the profile picture.
  static const double _avatarSize = 36;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.sm, IgongoSpace.sm),
      child: Row(
        children: [
          // Step 1: the logo mark, then the name with "Cultural Centre" under it.
          const IgongoLogo(height: 36),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Igongo',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.text.displaySmall?.copyWith(color: p.primary),
                ),
                Text(
                  'CULTURAL CENTRE',
                  style: context.text.labelSmall?.copyWith(
                    color: p.warning,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
          // Step 2: the bell with its alert dot, then the profile picture (a placeholder until wired).
          RoundIconButton(icon: Icons.notifications_none, tooltip: 'Notifications', showDot: true, onPressed: onBell),
          const SizedBox(width: IgongoSpace.sm),
          Tooltip(
            message: 'Profile',
            child: Container(
              width: _avatarSize,
              height: _avatarSize,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: p.primaryContainer, shape: BoxShape.circle),
              child: Icon(Icons.person, size: IgongoSpace.lg, color: p.primary),
            ),
          ),
        ],
      ),
    );
  }
}
