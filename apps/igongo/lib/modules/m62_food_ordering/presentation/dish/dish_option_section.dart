// One customisation section on the dish page: a card with the group's name, a
// Required or Optional mark, and its choices. Single-choice groups show radio
// buttons (pick one); multi-choice groups show a 2-column grid of checkboxes (pick any).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/ugx.dart';
import '../../../../shared/theme/theme.dart';
import '../../domain/option_choice.dart';
import '../../domain/option_group.dart';
import 'dish_badge.dart';
import 'dish_choice_grid.dart';

/// One option group as a card of choices.
class DishOptionSection extends StatelessWidget {
  /// Creates the section for [group], with [picked] choice keys and the two callbacks.
  const DishOptionSection({
    super.key,
    required this.group,
    required this.picked,
    required this.onChoose,
    required this.onToggle,
  });

  /// The group shown.
  final OptionGroup group;

  /// The choice keys picked in this group.
  final Set<String> picked;

  /// Radio groups: pick exactly this choice.
  final ValueChanged<String> onChoose;

  /// Checkbox groups: flip this choice on or off.
  final ValueChanged<String> onToggle;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final text = context.text;
    // Step 1: the words above the choices: what the guest must do.
    final helper = group.multiple ? 'Choose any you like' : 'Choose one';
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
          // Step 2: the header: name and helper on the left, Required/Optional on the right.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(group.name, style: text.titleSmall),
                    Text(helper, style: text.bodySmall),
                  ],
                ),
              ),
              const SizedBox(width: IgongoSpace.sm),
              group.required
                  ? DishBadge(
                      label: 'Required',
                      background: palette.primaryContainer,
                      foreground: palette.onPrimaryContainer,
                    )
                  : DishBadge(label: 'Optional', background: palette.surfaceAlt, foreground: palette.textMuted),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the choices, as radio buttons or checkboxes.
          if (group.multiple)
            // Multi-choice groups (such as beverages and extras) are a 2-column grid of checkbox cards.
            DishChoiceGrid(choices: group.choices, picked: picked, onToggle: onToggle)
          else
            RadioGroup<String>(
              groupValue: picked.isEmpty ? null : picked.first,
              onChanged: (v) {
                if (v != null) onChoose(v);
              },
              child: Column(
                children: [
                  for (final c in group.choices)
                    _OptionRow(
                      choice: c,
                      selected: picked.contains(c.key),
                      control: IgnorePointer(child: Radio<String>(value: c.key)),
                      onTap: () => onChoose(c.key),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// One tappable choice: the control, the name, and what it adds to the price.
class _OptionRow extends StatelessWidget {
  const _OptionRow({required this.choice, required this.selected, required this.control, required this.onTap});

  /// The choice shown.
  final OptionChoice choice;

  /// True when it is picked (the row is tinted).
  final bool selected;

  /// The radio button or checkbox that shows the pick.
  final Widget control;

  /// What a tap on the row does.
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the price text: free choices say "Included", others show the add-on price.
    final price = choice.priceDelta == 0 ? 'Included' : '+${ugx(choice.priceDelta)}';
    return Padding(
      padding: const EdgeInsets.only(bottom: IgongoSpace.sm),
      child: Material(
        color: selected ? palette.primaryContainer : palette.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          side: BorderSide(color: selected ? palette.primaryText : palette.border),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          onTap: onTap,
          // Step 2: the whole row is the tap target, at least the minimum touch size tall.
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: IgongoTouch.minimum),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xs),
              child: Row(
                children: [
                  control,
                  const SizedBox(width: IgongoSpace.xs),
                  // Step 3: the name, wrapping onto more lines rather than cutting off.
                  Expanded(child: Text(choice.name, style: context.text.bodyLarge)),
                  const SizedBox(width: IgongoSpace.sm),
                  Text(price, style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
