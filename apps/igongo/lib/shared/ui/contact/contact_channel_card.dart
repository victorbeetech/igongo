// One contact channel on the Contact Us screen: a round icon, the title with a
// small status chip, a line of detail, and a full-width action button.
// The screen uses it for the phone, email and WhatsApp channels, so they all match.
// Every colour and size comes from the theme tokens.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A bordered white card for one way to reach the hotel.
class ContactChannelCard extends StatelessWidget {
  /// Creates the card. [glyph] sits inside the round disc at the left.
  const ContactChannelCard({
    super.key,
    required this.glyph,
    required this.discColor,
    required this.title,
    required this.chip,
    required this.detail,
    required this.actionLabel,
    required this.actionIcon,
    required this.actionColor,
    required this.actionTextColor,
    required this.onAction,
    this.chipLive = false,
  });

  /// The icon or logo inside the round disc.
  final Widget glyph;

  /// The fill of the round disc behind [glyph].
  final Color discColor;

  /// The channel name, such as "Call Front Desk".
  final String title;

  /// The short status text on the right of the title, such as "24/7".
  final String chip;

  /// True shows a small green dot before [chip] (used for "Live").
  final bool chipLive;

  /// One line of detail under the title: the number or address and a note.
  final String detail;

  /// The text on the action button.
  final String actionLabel;

  /// The icon at the start of the action button.
  final IconData actionIcon;

  /// The action button fill.
  final Color actionColor;

  /// The action button text and icon colour.
  final Color actionTextColor;

  /// What the action button does.
  final VoidCallback onAction;

  @override
  Widget build(BuildContext context) {
    // Step 1: read the theme once for this card (light or dark mode).
    final p = context.palette;
    return Container(
      decoration: BoxDecoration(
        color: p.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: p.border),
      ),
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 2: the round disc with the glyph, then the title, chip and detail.
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // The disc keeps its size when the text is scaled up.
              Container(
                width: 48,
                height: 48,
                alignment: Alignment.center,
                decoration: BoxDecoration(color: discColor, shape: BoxShape.circle),
                child: glyph,
              ),
              const SizedBox(width: IgongoSpace.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Step 3: the title and the status chip share one row; the title wraps if large text needs it.
                    Row(
                      children: [
                        Expanded(child: Text(title, style: context.text.titleMedium)),
                        const SizedBox(width: IgongoSpace.xs),
                        _Chip(label: chip, live: chipLive),
                      ],
                    ),
                    const SizedBox(height: IgongoSpace.xxs),
                    // Step 4: the detail line. It wraps rather than cuts off, so nothing is hidden.
                    Text(detail, style: context.text.bodySmall?.copyWith(color: p.textMuted)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 5: the full-width action button, at the preferred touch height.
          SizedBox(
            height: IgongoTouch.preferred,
            child: FilledButton.icon(
              onPressed: onAction,
              style: FilledButton.styleFrom(
                backgroundColor: actionColor,
                foregroundColor: actionTextColor,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(IgongoRadius.md)),
              ),
              icon: Icon(actionIcon, size: 18),
              label: Text(actionLabel, style: context.text.labelLarge),
            ),
          ),
        ],
      ),
    );
  }
}

/// The small rounded status label on the right of a card title.
/// A private widget: only [ContactChannelCard] uses it.
class _Chip extends StatelessWidget {
  /// Creates the chip with [label]. [live] adds a green dot before it.
  const _Chip({required this.label, required this.live});

  /// The chip text.
  final String label;

  /// True adds the green dot.
  final bool live;

  @override
  Widget build(BuildContext context) {
    // Step 1: read the theme colours for the chip.
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step 2: the green dot, only for a live channel.
          if (live) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(color: p.success, shape: BoxShape.circle),
            ),
            const SizedBox(width: IgongoSpace.xxs),
          ],
          // Step 3: the chip text in the label style.
          Text(label, style: context.text.labelSmall?.copyWith(color: live ? p.success : p.secondary)),
        ],
      ),
    );
  }
}
