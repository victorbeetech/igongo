// The bell on the guest home's top row: a round surface button with a small
// red dot for new alerts. Tapping it opens the notification inbox.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The round bell button.
class GuestBellButton extends StatelessWidget {
  /// Creates the bell; [onPressed] opens the inbox.
  const GuestBellButton({super.key, required this.onPressed});

  /// Called when the bell is tapped.
  final VoidCallback onPressed;

  /// The size of the round button in logical pixels.
  static const _size = 36.0;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IconButton(
      tooltip: 'Notifications',
      onPressed: onPressed,
      // Step 1: a round surface with a soft edge, the bell in the middle.
      icon: SizedBox(
        width: _size,
        height: _size,
        child: DecoratedBox(
          decoration: BoxDecoration(
            color: p.surface,
            shape: BoxShape.circle,
            border: Border.all(color: p.border),
          ),
          // Step 2: the bell and the alert dot in its corner.
          child: Stack(
            alignment: Alignment.center,
            children: [
              Icon(Icons.notifications_none, size: IgongoSpace.lg, color: p.text),
              Positioned(
                top: IgongoSpace.xs,
                right: IgongoSpace.xs,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: p.primaryText,
                    shape: BoxShape.circle,
                    border: Border.all(color: p.surface, width: IgongoSpace.xxs),
                  ),
                  child: const SizedBox(width: IgongoSpace.sm, height: IgongoSpace.sm),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
