// The centred message used by every state and result: an icon in a soft
// circle, a title, a line of text and up to two buttons.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A centred icon, title, message and actions.
class StateMessage extends StatelessWidget {
  /// Creates a message. [colour] tints the icon; it defaults to Igongo red.
  const StateMessage({
    super.key,
    required this.icon,
    required this.title,
    required this.message,
    this.colour,
    this.actions = const [],
  });

  /// The icon in the circle.
  final IconData icon;

  /// The title.
  final String title;

  /// One or two lines of explanation.
  final String message;

  /// The icon colour.
  final Color? colour;

  /// Buttons under the message.
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final tint = colour ?? context.palette.primary;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(IgongoSpace.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          spacing: IgongoSpace.md,
          children: [
            // Step 1: the icon in a soft circle of its own colour.
            Container(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              decoration: BoxDecoration(color: tint.withValues(alpha: 0.12), shape: BoxShape.circle),
              child: Icon(icon, size: 36, color: tint),
            ),
            // Step 2: the words, centred.
            Text(title, style: context.text.titleMedium, textAlign: TextAlign.center),
            Text(
              message,
              style: context.text.bodyMedium?.copyWith(color: context.palette.textMuted),
              textAlign: TextAlign.center,
            ),
            // Step 3: the actions, wrapping on narrow screens and large text.
            if (actions.isNotEmpty)
              Wrap(
                spacing: IgongoSpace.sm,
                runSpacing: IgongoSpace.sm,
                alignment: WrapAlignment.center,
                children: actions,
              ),
          ],
        ),
      ),
    );
  }
}
