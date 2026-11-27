// The eye at the end of a password box. Tapping it shows or hides what is
// typed. Sign-in and sign-up both use this one widget, so they behave the same.

import 'package:material_ui/material_ui.dart';

/// A show/hide eye button for a password box.
class PasswordEyeButton extends StatelessWidget {
  /// Creates the eye. [shown] says whether the text is visible right now.
  const PasswordEyeButton({super.key, required this.shown, required this.onPressed});

  /// Whether the password text is visible right now. Picks the icon and the tooltip.
  final bool shown;

  /// Called when the eye is tapped. The owner flips its own "shown" flag here.
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => IconButton(
    // Step 1: the tooltip tells a screen reader what tapping will do.
    tooltip: shown ? 'Hide password' : 'Show password',
    // Step 2: an open eye means "hidden, tap to show"; a crossed eye means "shown, tap to hide".
    icon: Icon(shown ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 18),
    // Step 3: hand the tap to the owner, which changes the flag.
    onPressed: onPressed,
  );
}
