// A password box with its show/hide eye. Every password box in the app uses
// this one widget, so the eye and the hidden text behave the same everywhere.
// The owner of the box keeps the "shown" flag, so one flag can drive several
// boxes together (the sign-up screen shows both its boxes with one eye).

import 'package:flutter/widgets.dart';

import 'igongo_field.dart';
import 'password_eye.dart';

/// A password box with an eye at the end. Typed text is kept when the eye is tapped.
class PasswordField extends StatelessWidget {
  /// Creates a password box. [shown] says whether the text is visible; [onToggle] flips it.
  /// [floatingLabel] passes through to [IgongoField]: the label becomes the placeholder.
  const PasswordField({
    super.key,
    required this.label,
    required this.controller,
    required this.shown,
    required this.onToggle,
    this.hint,
    this.icon,
    this.onSubmitted,
    this.floatingLabel = false,
  });

  /// The label above the box, or the placeholder inside it when [floatingLabel] is on.
  final String label;

  /// Sample text inside the box, when different from the label.
  final String? hint;

  /// An icon at the start of the box.
  final IconData? icon;

  /// Holds the typed password. Changing [shown] never clears it.
  final TextEditingController controller;

  /// Whether the password is visible right now. Hidden when false.
  final bool shown;

  /// Called when the eye is tapped. The owner flips its own [shown] flag here.
  final VoidCallback onToggle;

  /// Called when the person presses Done on the keyboard.
  final ValueChanged<String>? onSubmitted;

  /// True to show the label only as a floating placeholder inside the box.
  final bool floatingLabel;

  @override
  Widget build(BuildContext context) => IgongoField(
    label: label,
    hint: hint,
    icon: icon,
    // Step 1: hide the text unless the eye has been tapped to show it.
    obscure: !shown,
    controller: controller,
    onSubmitted: onSubmitted,
    floatingLabel: floatingLabel,
    // Step 2: the eye at the end of the box, which only flips the flag.
    suffix: PasswordEyeButton(shown: shown, onPressed: onToggle),
  );
}
