// The one text field used in every form. By default it shows a label above the
// box, with an optional hint and icon. Auth screens set [floatingLabel] instead:
// then there is no label above the box, the label is the placeholder inside it,
// and Flutter's floating label moves it to the top border once the box is focused.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A text field: a label above the box, or (with [floatingLabel]) a placeholder that floats on focus.
class IgongoField extends StatelessWidget {
  /// Creates a field with its [label]. [obscure] hides the text, for passwords.
  /// [floatingLabel] puts the label inside the box instead of above it.
  const IgongoField({
    super.key,
    required this.label,
    this.hint,
    this.icon,
    this.obscure = false,
    this.lines = 1,
    this.controller,
    this.keyboardType,
    this.onSubmitted,
    this.onChanged,
    this.suffix,
    this.floatingLabel = false,
  });

  /// The label above the box, or the placeholder inside it when [floatingLabel] is on.
  final String label;

  /// Sample text inside the box. Ignored when [floatingLabel] is on, because the label is the placeholder.
  final String? hint;

  /// An icon at the start of the box.
  final IconData? icon;

  /// Whether to hide what is typed.
  final bool obscure;

  /// How many lines the box shows.
  final int lines;

  /// Holds what is typed, for live forms.
  final TextEditingController? controller;

  /// The keyboard to show, such as email.
  final TextInputType? keyboardType;

  /// Called when the person presses Done.
  final ValueChanged<String>? onSubmitted;

  /// Called on every change, for forms without a controller.
  final ValueChanged<String>? onChanged;

  /// A widget at the end of the box, such as the show-password eye.
  final Widget? suffix;

  /// True to show the label only as a placeholder inside the box, floating to the top border on focus.
  final bool floatingLabel;

  @override
  Widget build(BuildContext context) {
    // Step 1: the box itself, the same in both styles.
    final field = TextField(
      controller: controller,
      keyboardType: keyboardType,
      onSubmitted: onSubmitted,
      onChanged: onChanged,
      obscureText: obscure,
      maxLines: obscure ? 1 : lines,
      decoration: floatingLabel
          // Step 2a: the label is the placeholder; Flutter floats it to the border on focus.
          ? InputDecoration(
              labelText: label,
              prefixIcon: icon == null ? null : Icon(icon, size: 18),
              suffixIcon: suffix,
            )
          // Step 2b: the usual style, with the hint inside and nothing floating.
          : InputDecoration(
              hintText: hint ?? label,
              prefixIcon: icon == null ? null : Icon(icon, size: 18),
              suffixIcon: suffix,
            ),
    );
    // Step 3: with a floating label there is no separate label above the box.
    if (floatingLabel) return field;
    // Step 4: otherwise the label sits above the box, as before.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xs,
      children: [
        Text(label, style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
        field,
      ],
    );
  }
}
