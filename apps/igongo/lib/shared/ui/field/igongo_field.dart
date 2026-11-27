// The one text field used in every form: a label above the box, as the
// design asks, with an optional hint and icon.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A labelled text field.
class IgongoField extends StatelessWidget {
  /// Creates a field with its [label]. [obscure] hides the text, for passwords.
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
  });

  /// The label above the box.
  final String label;

  /// Sample text inside the box.
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

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xs,
      children: [
        Text(label, style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          onSubmitted: onSubmitted,
          onChanged: onChanged,
          obscureText: obscure,
          maxLines: obscure ? 1 : lines,
          decoration: InputDecoration(
            hintText: hint ?? label, prefixIcon: icon == null ? null : Icon(icon, size: 18),
            suffixIcon: suffix,
          ),
        ),
      ],
    );
  }
}
