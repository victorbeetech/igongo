// The cultural tour reminder from the past days: the tour time, the guide and the meeting place.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import 'updates_card_frame.dart';

/// The tour reminder card. Its content is placeholder until the news feed is wired.
class CulturalTourUpdateCard extends StatelessWidget {
  /// Creates the card.
  const CulturalTourUpdateCard({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final text = context.text;
    return UpdatesCardFrame(
      icon: Icons.tour,
      iconBackground: p.surfaceAlt,
      iconColor: p.text,
      title: 'Cultural Tour Reminder',
      time: 'Yesterday',
      muted: true,
      body: Text.rich(
        TextSpan(
          style: text.bodyMedium?.copyWith(color: p.textMuted),
          children: [
            const TextSpan(text: 'The guided '),
            TextSpan(
              text: 'Ankole Longhorn Heritage & Royal Drum Tour',
              style: TextStyle(color: p.text, fontWeight: FontWeight.w600),
            ),
            const TextSpan(text: ' starts tomorrow at 9:00 AM at the Eriijukiro Museum main foyer.'),
          ],
        ),
      ),
      // The guide and the place, as two small chips.
      details: const Wrap(
        spacing: IgongoSpace.sm,
        runSpacing: IgongoSpace.xs,
        children: [
          _InfoChip(icon: Icons.explore, label: 'Guide: Kenneth B.'),
          _InfoChip(icon: Icons.place, label: 'Museum Foyer'),
        ],
      ),
    );
  }
}

/// A small grey chip with an icon and a label, for details such as the guide.
class _InfoChip extends StatelessWidget {
  /// Creates the chip.
  const _InfoChip({required this.icon, required this.label});

  /// The icon before the label.
  final IconData icon;

  /// The words on the chip.
  final String label;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xs),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.pill)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: p.primaryText),
          const SizedBox(width: IgongoSpace.xs),
          Flexible(
            child: Text(
              label,
              overflow: TextOverflow.ellipsis,
              style: context.text.labelSmall?.copyWith(color: p.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}
