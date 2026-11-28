// The shared frame of every Updates card: a soft surface with a round icon, the
// title and time on one line, then the body. Optional details sit under the
// body, and an optional footer (such as a photo strip) runs the full width.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_icon_avatar.dart';
import 'updates_unread_dot.dart';

/// One update card. Each card type builds its own [body], [details] and [footer].
class UpdatesCardFrame extends StatelessWidget {
  /// Creates the card frame.
  const UpdatesCardFrame({
    super.key,
    required this.icon,
    required this.iconBackground,
    required this.iconColor,
    required this.title,
    required this.time,
    required this.body,
    this.unread = false,
    this.muted = false,
    this.details,
    this.footer,
  });

  /// The icon in the round disc at the start.
  final IconData icon;

  /// The disc's tint.
  final Color iconBackground;

  /// The icon's colour.
  final Color iconColor;

  /// The card's heading.
  final String title;

  /// When it happened, such as "12 mins ago".
  final String time;

  /// The message under the heading.
  final Widget body;

  /// Whether to show the red unread dot after the time.
  final bool unread;

  /// True for older cards, which sit a little quieter than new ones.
  final bool muted;

  /// Extra content under the body, inside the text column (chips, a button row).
  final Widget? details;

  /// Content that runs the full width under the row (a photo strip).
  final Widget? footer;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return Container(
      // Step 1: the surface, a quiet tinted shadow and the token radius.
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: muted ? p.surface.withValues(alpha: 0.9) : p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        boxShadow: [
          BoxShadow(
            color: p.primary.withValues(alpha: muted ? 0.03 : 0.05),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.md,
        children: [
          // Step 2: the icon on the left, the text column on the right.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              UpdatesIconAvatar(icon: icon, background: iconBackground, foreground: iconColor),
              const SizedBox(width: IgongoSpace.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    // Step 3: the title, then the time and the unread dot, on one line.
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: text.titleMedium?.copyWith(color: p.text, fontWeight: FontWeight.w600),
                          ),
                        ),
                        const SizedBox(width: IgongoSpace.sm),
                        Text(time, style: text.labelMedium?.copyWith(color: p.textMuted)),
                        if (unread) ...[const SizedBox(width: IgongoSpace.xs), const UpdatesUnreadDot()],
                      ],
                    ),
                    body,
                    ?details,
                  ],
                ),
              ),
            ],
          ),
          // Step 4: the full-width footer, if the card has one.
          ?footer,
        ],
      ),
    );
  }
}
