// A small rounded label used on the dish page: prep time, dietary tags,
// the required/optional mark and allergens. Colours come from the caller
// (theme tokens), so the same badge works in light and dark mode.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A pill with an optional icon and a label.
class DishBadge extends StatelessWidget {
  /// Creates a badge showing [label] in [foreground] on [background].
  const DishBadge({
    super.key,
    required this.label,
    required this.background,
    required this.foreground,
    this.icon,
    this.border,
  });

  /// The words on the badge.
  final String label;

  /// The fill colour (a theme token).
  final Color background;

  /// The text and icon colour (a theme token).
  final Color foreground;

  /// An optional icon before the label.
  final IconData? icon;

  /// An optional outline colour (a theme token).
  final Color? border;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs + 1),
    decoration: BoxDecoration(
      color: background,
      borderRadius: BorderRadius.circular(IgongoRadius.pill),
      border: border == null ? null : Border.all(color: border!),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Step 1: the icon, when the badge has one.
        if (icon != null) ...[Icon(icon, size: 14, color: foreground), const SizedBox(width: IgongoSpace.xxs + 2)],
        // Step 2: the label, kept to small text so it fits on phones.
        Flexible(
          child: Text(
            label,
            style: context.text.labelSmall?.copyWith(color: foreground, fontWeight: FontWeight.w600),
          ),
        ),
      ],
    ),
  );
}
