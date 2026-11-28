// A labelled box for a form, as the Edit Profile design draws it: the label on
// the left, a short hint on the right, and a filled box with an optional leading
// icon. Colours, radius and type come from the theme, so it follows light and dark.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A filled text field with a label row above it.
class IgongoHintField extends StatelessWidget {
  /// Creates a field. [lines] above 1 makes a text area.
  const IgongoHintField({
    super.key,
    required this.label,
    this.hint,
    this.hintColor,
    this.icon,
    this.placeholder,
    this.controller,
    this.keyboardType,
    this.lines = 1,
  });

  /// The label above the box, such as "Full Name".
  final String label;

  /// A short note on the right of the label, such as "Required".
  final String? hint;

  /// The colour of [hint]; muted when null.
  final Color? hintColor;

  /// An icon at the start of the box.
  final IconData? icon;

  /// Grey text shown while the box is empty.
  final String? placeholder;

  /// Holds what is typed.
  final TextEditingController? controller;

  /// The keyboard to show, such as a phone pad.
  final TextInputType? keyboardType;

  /// How many lines the box shows. Above 1 it is a text area.
  final int lines;

  @override
  Widget build(BuildContext context) {
    // Step 1: the palette and the box's rounded edge, read from the theme.
    final p = context.palette;
    final edge = OutlineInputBorder(borderRadius: BorderRadius.circular(IgongoRadius.md), borderSide: BorderSide.none);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: IgongoSpace.xs,
      children: [
        // Step 2: the label, then the hint on the same row.
        Row(
          children: [
            Expanded(child: Text(label, style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700))),
            if (hint != null)
              Text(hint!, style: context.text.labelSmall?.copyWith(color: hintColor ?? p.textMuted)),
          ],
        ),
        // Step 3: the filled box, with its icon when it has one.
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          minLines: lines,
          maxLines: lines,
          decoration: InputDecoration(
            hintText: placeholder,
            prefixIcon: icon == null ? null : Icon(icon, size: 20),
            filled: true,
            fillColor: p.surfaceAlt,
            border: edge,
            enabledBorder: edge,
            focusedBorder: edge.copyWith(borderSide: BorderSide(color: p.primary, width: 1.5)),
          ),
        ),
      ],
    );
  }
}
