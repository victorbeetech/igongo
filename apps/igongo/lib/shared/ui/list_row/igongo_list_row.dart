// The one list row used in every list: avatar, title, subtitle, an optional
// status chip and a chevron when it opens something.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../avatar/initials_avatar.dart';
import '../chip/status_chip.dart';

/// One row of a list.
class IgongoListRow extends StatelessWidget {
  /// Creates a row. Give [onTap] to show the chevron and make it tappable.
  const IgongoListRow({super.key, required this.title, this.subtitle, this.status, this.leading, this.onTap});

  /// The main words.
  final String title;

  /// A second line, such as a time or a place.
  final String? subtitle;

  /// A status word shown as a chip.
  final String? status;

  /// A widget in place of the initials avatar, such as an icon.
  final Widget? leading;

  /// What happens on tap.
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: ConstrainedBox(
        // Every row is at least a comfortable tap target.
        constraints: const BoxConstraints(minHeight: IgongoTouch.preferred + 8),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
          child: Row(
            spacing: IgongoSpace.md,
            children: [
              leading ?? InitialsAvatar(name: title),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 2,
                  children: [
                    Text(title, style: context.text.titleSmall, maxLines: 2, overflow: TextOverflow.ellipsis),
                    if (subtitle != null)
                      Text(subtitle!, style: context.text.bodySmall, maxLines: 2, overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
              if (status != null) StatusChip(status!),
              if (onTap != null) Icon(Icons.chevron_right, size: 20, color: context.palette.textMuted),
            ],
          ),
        ),
      ),
    );
  }
}
