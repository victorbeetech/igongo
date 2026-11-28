// The My receipts empty state: a badge, "No receipts yet", an explore button,
// a note about paper receipts, and the popular places to visit.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';

/// Shown when the guest has no receipts yet.
class ReceiptEmptyState extends StatelessWidget {
  /// Creates the empty state; [onExplore] opens dining and stays.
  const ReceiptEmptyState({super.key, required this.onExplore});

  /// Called when "Explore Dining & Stays" is tapped.
  final VoidCallback onExplore;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.md,
      children: [
        const SizedBox(height: IgongoSpace.xl),
        // Step 1: the round emblem with the receipt badge on its edge.
        const Center(child: _Emblem()),
        Text('No receipts yet', style: context.text.headlineSmall, textAlign: TextAlign.center),
        Text(
          'Your dining bills, luxury cottage stays, and cultural tour receipts will appear here automatically after your visit.',
          style: context.text.bodyMedium?.copyWith(color: p.textMuted),
          textAlign: TextAlign.center,
        ),
        // Step 2: the single action.
        IgongoButton(label: 'Explore Dining & Stays', icon: Icons.arrow_forward, expand: true, onPressed: onExplore),
        // Step 3: the paper receipt note.
        const _PaperNote(),
        // Step 4: the popular places.
        Text('POPULAR AT IGONGO', style: context.text.labelSmall?.copyWith(color: p.accent)),
        const Row(
          spacing: IgongoSpace.sm,
          children: [
            Expanded(
              child: _PlaceTile(icon: Icons.restaurant_menu, title: 'Kahwa2Go Cafe', subtitle: 'Eshabwe & Coffee'),
            ),
            Expanded(
              child: _PlaceTile(icon: Icons.museum, title: 'Erijukiro Museum', subtitle: 'Tour passes'),
            ),
          ],
        ),
      ],
    );
  }
}

/// The emblem: two soft rings around a receipt badge.
class _Emblem extends StatelessWidget {
  /// Creates the emblem.
  const _Emblem();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return SizedBox(
      width: IgongoTouch.preferred * 2.2,
      height: IgongoTouch.preferred * 2.2,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Outer ring in the soft surface tone.
          Container(
            width: IgongoTouch.preferred * 2.2,
            height: IgongoTouch.preferred * 2.2,
            decoration: BoxDecoration(color: p.surfaceAlt, shape: BoxShape.circle),
          ),
          // Inner disc with the crimson mark.
          Container(
            width: IgongoTouch.preferred * 1.6,
            height: IgongoTouch.preferred * 1.6,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: p.surface,
              shape: BoxShape.circle,
              border: Border.all(color: p.border),
            ),
            child: Icon(Icons.receipt_long, size: IgongoTouch.preferred * 0.6, color: p.primary),
          ),
          // The accent badge on the lower right edge.
          Positioned(
            right: 0,
            bottom: 0,
            child: Container(
              width: IgongoTouch.minimum,
              height: IgongoTouch.minimum,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: p.accent, shape: BoxShape.circle),
              child: Icon(Icons.receipt, size: IgongoSpace.lg, color: p.text),
            ),
          ),
        ],
      ),
    );
  }
}

/// The soft panel that explains paper receipts.
class _PaperNote extends StatelessWidget {
  /// Creates the note.
  const _PaperNote();

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.info_outline, color: p.accent),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Holding a paper receipt?', style: context.text.titleSmall),
                Text(
                  'Present your printed voucher code at the front reception desk or dining counter to link it to your account.',
                  style: context.text.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// One popular place: an icon, its name and a short line.
class _PlaceTile extends StatelessWidget {
  /// Creates a tile.
  const _PlaceTile({required this.icon, required this.title, required this.subtitle});

  /// The place's icon.
  final IconData icon;

  /// The place's name.
  final String title;

  /// A short line under the name.
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        children: [
          Icon(icon, color: p.primaryText),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: context.text.labelLarge, maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(subtitle, style: context.text.bodySmall, maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
