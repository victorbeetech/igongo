// One row of an action list on My profile: a round icon, the title, an
// optional value on the right (such as "Light") and a chevron. Rows in the
// activity group have a solid red icon; the others have a soft one; the
// delete row is red.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// A tappable row with an icon disc, a title and a chevron.
class ProfileActionRow extends StatelessWidget {
  /// Creates a row. Give [onTap] to make it tappable.
  const ProfileActionRow({
    super.key,
    required this.title,
    required this.icon,
    required this.onTap,
    this.value,
    this.solid = false,
    this.destructive = false,
  });

  /// The row's words, such as "Receipts".
  final String title;

  /// The icon in the round disc.
  final IconData icon;

  /// What happens on tap.
  final VoidCallback onTap;

  /// Words shown before the chevron, such as the current theme.
  final String? value;

  /// True for the activity rows: a solid red disc with a light icon.
  final bool solid;

  /// True for the delete row: red title and icon.
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    // Step 1: colours for the disc and the title, by the row's kind.
    final discFill = solid ? p.primary : p.primaryContainer;
    final discInk = solid ? p.onPrimary : (destructive ? p.error : p.primaryText);
    final titleInk = destructive ? p.error : p.text;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.xxs),
      child: Material(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        child: InkWell(
          borderRadius: BorderRadius.circular(IgongoRadius.md),
          onTap: onTap,
          child: ConstrainedBox(
            // Step 2: at least a comfortable tap target tall.
            constraints: const BoxConstraints(minHeight: IgongoTouch.preferred + 4),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xs),
              child: Row(
                spacing: IgongoSpace.md,
                children: [
                  // Step 3: the round icon disc.
                  Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: discFill, shape: BoxShape.circle),
                    child: Icon(icon, size: 20, color: discInk),
                  ),
                  // Step 4: the title fills the middle; the value sits before the chevron.
                  Expanded(
                    child: Text(title, style: context.text.titleSmall?.copyWith(color: titleInk), maxLines: 2, overflow: TextOverflow.ellipsis),
                  ),
                  if (value != null) Text(value!, style: context.text.bodyMedium?.copyWith(color: p.textMuted)),
                  Icon(Icons.chevron_right, size: 22, color: p.textMuted),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
