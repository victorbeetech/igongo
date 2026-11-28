// The "All caught up" message shown when the chosen filter has no updates,
// with a button that goes back to All.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_pill_button.dart';

/// The message for an empty filter, with a way back to every update.
class UpdatesEmptyState extends StatelessWidget {
  /// Creates the message. [onViewAll] shows every update again.
  const UpdatesEmptyState({super.key, required this.onViewAll});

  /// Called when the person taps "View All Notifications".
  final VoidCallback onViewAll;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.xl, vertical: IgongoSpace.xxl),
      child: Column(
        children: [
          // Step 1: the round icon, in the quiet surface tint.
          Container(
            width: 64,
            height: 64,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: p.surfaceAlt, shape: BoxShape.circle),
            child: Icon(Icons.notifications_paused, size: 32, color: p.primaryText),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the heading and the short line under it.
          Text('All caught up', style: text.headlineSmall?.copyWith(color: p.text)),
          const SizedBox(height: IgongoSpace.xs),
          Text(
            'No new updates in this category right now. Relax and immerse yourself in the royal Ankole heritage.',
            textAlign: TextAlign.center,
            style: text.bodyMedium?.copyWith(color: p.textMuted),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: the way back to every update.
          UpdatesPillButton(
            label: 'View All Notifications',
            background: p.surfaceAlt,
            foreground: p.primary,
            onPressed: onViewAll,
          ),
        ],
      ),
    );
  }
}
