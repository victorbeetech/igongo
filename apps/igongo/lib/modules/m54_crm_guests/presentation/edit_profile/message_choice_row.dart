// One message choice: an icon, its name and a short line, and a switch. The
// whole row toggles the switch.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// A tappable row with a switch on the right.
class MessageChoiceRow extends StatelessWidget {
  /// Creates the row.
  const MessageChoiceRow({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    this.iconFill,
  });

  /// The icon in the round badge.
  final IconData icon;

  /// The choice's name, such as "SMS Notifications".
  final String title;

  /// A short line under the name.
  final String subtitle;

  /// Whether the choice is on.
  final bool value;

  /// Called with the new value when the row or switch is tapped.
  final ValueChanged<bool> onChanged;

  /// The badge's fill; a neutral grey when null.
  final Color? iconFill;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return InkWell(
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      onTap: () => onChanged(!value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.sm),
        decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
        child: Row(
          spacing: IgongoSpace.md,
          children: [
            // Step 1: the round icon badge.
            Container(
              width: 32,
              height: 32,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: iconFill ?? p.border, shape: BoxShape.circle),
              child: Icon(icon, size: 18, color: p.text),
            ),
            // Step 2: the name and its line, taking the room between.
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: context.text.labelLarge),
                  Text(subtitle, style: context.text.bodySmall),
                ],
              ),
            ),
            // Step 3: the switch.
            Switch(value: value, onChanged: onChanged),
          ],
        ),
      ),
    );
  }
}
