// A small rounded label, used for the "Guest account" chip and the Edit button.
// Give [onTap] to make it a button, and [icon] to put an icon before the words.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A rounded pill with an optional icon and a short label.
class ProfilePill extends StatelessWidget {
  /// Creates a pill. Colours default to the light red container.
  const ProfilePill({super.key, required this.label, this.icon, this.onTap, this.fill, this.foreground});

  /// The words, such as "Guest account".
  final String label;

  /// The icon shown before the label, if any.
  final IconData? icon;

  /// What happens on tap; null makes the pill a plain label.
  final VoidCallback? onTap;

  /// Background colour; defaults to the primary container.
  final Color? fill;

  /// Icon and text colour; defaults to the primary text colour.
  final Color? foreground;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final ink = foreground ?? p.primaryText;
    final body = Container(
      // Step 1: the pill's padding keeps the tap target comfortable.
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(color: fill ?? p.primaryContainer, borderRadius: BorderRadius.circular(999)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step 2: the optional icon, then the label.
          if (icon != null) ...[Icon(icon, size: 14, color: ink), const SizedBox(width: 4)],
          Flexible(
            child: Text(
              label,
              style: context.text.labelMedium?.copyWith(color: ink),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
    // Step 3: a plain label, or a button when there is something to do.
    if (onTap == null) return body;
    return Semantics(
      button: true,
      label: label,
      child: InkWell(borderRadius: BorderRadius.circular(999), onTap: onTap, child: body),
    );
  }
}
