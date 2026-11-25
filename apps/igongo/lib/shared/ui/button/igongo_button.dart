// The one button used on every screen, in four variants. Its colours and
// shape come from the theme, so screens never style a button themselves.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import 'button_variant.dart';

export 'button_variant.dart';

/// An Igongo button with an optional icon.
class IgongoButton extends StatelessWidget {
  /// Creates a button. Leave [onPressed] null to show it disabled.
  const IgongoButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.variant = ButtonVariant.primary,
    this.expand = false,
  });

  /// The words on the button.
  final String label;

  /// What happens on tap.
  final VoidCallback? onPressed;

  /// An optional icon before the label.
  final IconData? icon;

  /// How important the action is.
  final ButtonVariant variant;

  /// Whether the button fills the width it is given.
  final bool expand;

  @override
  Widget build(BuildContext context) {
    // Step 1: the label, with the icon when there is one.
    final child = icon == null
        ? Text(label)
        : Row(
            mainAxisSize: MainAxisSize.min,
            spacing: 6,
            children: [
              Icon(icon, size: 18),
              Flexible(child: Text(label)),
            ],
          );
    // Step 2: the button for the variant; danger reuses the filled button in the error colour.
    final button = switch (variant) {
      ButtonVariant.primary => FilledButton(onPressed: onPressed, child: child),
      ButtonVariant.danger => FilledButton(
        onPressed: onPressed,
        style: FilledButton.styleFrom(
          backgroundColor: context.palette.error,
          foregroundColor: context.palette.background, // Page colour on red reads in both modes.
        ),
        child: child,
      ),
      ButtonVariant.secondary => OutlinedButton(onPressed: onPressed, child: child),
      ButtonVariant.text => TextButton(onPressed: onPressed, child: child),
    };
    // Step 3: stretch to the full width when asked.
    return expand ? SizedBox(width: double.infinity, child: button) : button;
  }
}
