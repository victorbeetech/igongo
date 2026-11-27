// The special-instructions box at the end of the dish page. The guest's note
// goes to the kitchen with this dish. The counter (for example 0/300) comes
// from the field's maximum length.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'dish_badge.dart';

/// The note for the kitchen, up to [maxLength] characters.
class DishNoteField extends StatelessWidget {
  /// Creates the field with its [controller].
  const DishNoteField({super.key, required this.controller, this.maxLength = 300});

  /// Holds what the guest typed.
  final TextEditingController controller;

  /// The longest note allowed, in characters.
  final int maxLength;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final text = context.text;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: palette.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step 1: the heading, with Optional on the right.
          Row(
            children: [
              Expanded(child: Text('Special instructions', style: text.titleSmall)),
              DishBadge(label: 'Optional', background: palette.surfaceAlt, foreground: palette.textMuted),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text('Any dietary needs, allergies or cooking preferences?', style: text.bodySmall),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the text box; its counter shows how many characters are left.
          TextField(
            controller: controller,
            maxLength: maxLength,
            maxLines: 3,
            minLines: 3,
            decoration: const InputDecoration(hintText: 'For example: extra lemon on the side, no hot peppers'),
          ),
        ],
      ),
    );
  }
}
