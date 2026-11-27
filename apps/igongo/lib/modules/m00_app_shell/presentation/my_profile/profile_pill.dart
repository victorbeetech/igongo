// A small rounded label with an icon, used for "Guest account" and the Edit button.
// Give [onTap] to make it a button.

import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A rounded pill: an icon and a short label.
class ProfilePill extends StatelessWidget {
  /// Creates a pill. Colours default to the light red container.
  const ProfilePill({
    super.key,
    required this.icon,
    required this.label,
    this.onTap,
    this.fill,
    this.foreground,
  });

  /// The icon shown before the label.
  final IconData icon;

  /// The words, such as "Guest account".
  final String label;

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
          Icon(icon, size: 16, color: ink),
          const SizedBox(width: 6),
          Flexible(
            child: Text(label, style: context.text.labelMedium?.copyWith(color: ink), overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
    // Step 2: a plain label, or a button when there is something to do.
    if (onTap == null) return body;
    return Semantics(
      button: true,
      label: label,
      child: InkWell(borderRadius: BorderRadius.circular(999), onTap: onTap, child: body),
    );
  }
}
