// One selectable option card: a radio (pick one) or a checkbox (pick many),
// a title, an optional description, tags, and an optional amount on the right.
// Used for experiences, sessions, slots, add-ons and deposit options.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/shared/theme/theme.dart';

/// A tappable option card with a radio or checkbox on the left.
class FlowChoiceTile extends StatelessWidget {
  /// Creates the tile. [checkbox] switches the control from radio to checkbox.
  const FlowChoiceTile({
    super.key,
    required this.title,
    required this.selected,
    required this.onTap,
    this.subtitle,
    this.tags = const [],
    this.amount,
    this.checkbox = false,
    this.enabled = true,
  });

  /// The option name.
  final String title;

  /// Whether this option is currently picked.
  final bool selected;

  /// Called when the guest taps the card.
  final VoidCallback? onTap;

  /// Optional line of detail under the title.
  final String? subtitle;

  /// Optional tag widgets (see FlowTag) shown under the text.
  final List<Widget> tags;

  /// Optional amount text on the right (a placeholder until the API supplies it).
  final String? amount;

  /// True to show a checkbox instead of a radio.
  final bool checkbox;

  /// False to show the tile greyed out and not tappable.
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the control icon (radio or checkbox), filled when selected.
    final IconData controlIcon = checkbox
        ? (selected ? Icons.check_box : Icons.check_box_outline_blank)
        : (selected ? Icons.radio_button_checked : Icons.radio_button_unchecked);
    final controlColor = selected ? palette.primary : palette.textMuted;
    // Step 2: the card, with a red outline when selected.
    return Opacity(
      opacity: enabled ? 1 : 0.5,
      child: Material(
        color: palette.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          side: BorderSide(color: selected ? palette.primary : palette.border, width: selected ? 1.5 : 1),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.lg),
          onTap: enabled ? onTap : null,
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(controlIcon, color: controlColor, size: 22),
                const SizedBox(width: IgongoSpace.sm),
                // Step 3: the name, detail and tags.
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
                      if (subtitle != null) ...[
                        const SizedBox(height: IgongoSpace.xxs),
                        Text(
                          subtitle!,
                          style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                        ),
                      ],
                      if (tags.isNotEmpty) ...[
                        const SizedBox(height: IgongoSpace.xs),
                        Wrap(spacing: IgongoSpace.xs, runSpacing: IgongoSpace.xs, children: tags),
                      ],
                    ],
                  ),
                ),
                // Step 4: the amount on the right, if the screen shows one.
                if (amount != null) ...[
                  const SizedBox(width: IgongoSpace.sm),
                  Text(
                    amount!,
                    style: context.text.titleSmall?.copyWith(color: palette.primary, fontWeight: FontWeight.w700),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
