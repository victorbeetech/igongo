// The Updates title in the brand face, the count of new updates, and the
// "Mark all as read" action on the right.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The page title, the new-count pill and the mark-all action.
class UpdatesTitleRow extends StatelessWidget {
  /// Creates the row for [unreadCount] unread updates.
  const UpdatesTitleRow({super.key, required this.unreadCount, required this.onMarkAllRead});

  /// How many updates are still unread. Zero shows the quiet count and disables the action.
  final int unreadCount;

  /// Called when the person taps "Mark all as read".
  final VoidCallback onMarkAllRead;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final allRead = unreadCount == 0;
    return Padding(
      padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.sm, 0),
      child: Row(
        children: [
          // Step 1: the title and the count pill wrap onto a second line when the text is large.
          Expanded(
            child: Wrap(
              crossAxisAlignment: WrapCrossAlignment.center,
              spacing: IgongoSpace.sm,
              runSpacing: IgongoSpace.xs,
              children: [
                Text('Updates', style: context.text.displaySmall?.copyWith(color: p.primary)),
                _CountPill(count: unreadCount),
              ],
            ),
          ),
          // Step 2: the action. It is disabled once everything is read.
          TextButton.icon(
            onPressed: allRead ? null : onMarkAllRead,
            icon: Icon(allRead ? Icons.done : Icons.done_all, size: 17),
            label: Text(allRead ? 'All read' : 'Mark all as read'),
            style: TextButton.styleFrom(
              foregroundColor: p.primary,
              minimumSize: const Size(48, 48),
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm),
            ),
          ),
        ],
      ),
    );
  }
}

/// The small pill showing "N new" in red, or a quiet "0 new" once all are read.
class _CountPill extends StatelessWidget {
  /// Creates the pill for [count].
  const _CountPill({required this.count});

  /// How many updates are new.
  final int count;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final hasNew = count > 0;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(
        color: hasNew ? p.primary : p.surfaceAlt,
        borderRadius: BorderRadius.circular(IgongoRadius.pill),
      ),
      child: Text(
        '$count new',
        style: context.text.labelSmall?.copyWith(
          color: hasNew ? p.onPrimary : p.textMuted,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
