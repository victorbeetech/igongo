// A small pill button used on the Updates cards (Directions, View Offer and the
// preferences link). Its colours are passed in from the theme, never typed here.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A pill with a label and an optional icon before or after it.
class UpdatesPillButton extends StatelessWidget {
  /// Creates the pill. Leave [onPressed] null to show it disabled.
  const UpdatesPillButton({
    super.key,
    required this.label,
    required this.background,
    required this.foreground,
    required this.onPressed,
    this.leading,
    this.trailing,
  });

  /// The words on the pill.
  final String label;

  /// The pill's fill colour, from the theme.
  final Color background;

  /// The colour of the label and icons, from the theme.
  final Color foreground;

  /// What happens on tap.
  final VoidCallback? onPressed;

  /// An icon drawn before the label, if any.
  final IconData? leading;

  /// An icon drawn after the label, if any.
  final IconData? trailing;

  @override
  Widget build(BuildContext context) {
    final style = context.text.labelMedium?.copyWith(color: foreground, fontWeight: FontWeight.w600);
    return Material(
      color: background,
      shape: const StadiumBorder(),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onPressed,
        // Step 1: the tap area is at least 48 pixels, whatever the pill's visible size.
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.md),
            // Step 2: the icons and label in a row, centred vertically.
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (leading != null) ...[
                  Icon(leading, size: 16, color: foreground),
                  const SizedBox(width: IgongoSpace.xs),
                ],
                Text(label, style: style),
                if (trailing != null) ...[
                  const SizedBox(width: IgongoSpace.xs),
                  Icon(trailing, size: 16, color: foreground),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
