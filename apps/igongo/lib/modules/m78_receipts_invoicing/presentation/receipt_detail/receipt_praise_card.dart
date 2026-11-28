// The praise card under the ticket: "Enjoyed your Tilapia?" with a Send Praise
// button. Tapping it switches the label to "Thank You!". Nothing is sent yet.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// The chef praise card. It keeps its own state so the thank-you shows on tap.
class ReceiptPraiseCard extends StatefulWidget {
  /// Creates the card.
  const ReceiptPraiseCard({super.key});

  @override
  State<ReceiptPraiseCard> createState() => _ReceiptPraiseCardState();
}

class _ReceiptPraiseCardState extends State<ReceiptPraiseCard> {
  /// Whether the guest has already sent praise on this screen.
  bool _sent = false;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(color: p.surfaceAlt, borderRadius: BorderRadius.circular(IgongoRadius.md)),
      child: Row(
        children: [
          Icon(Icons.room_service_outlined, color: p.accent),
          const SizedBox(width: IgongoSpace.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Enjoyed your Tilapia?', style: context.text.labelLarge),
                Text('Compliments to Head Chef Tumusiime', style: context.text.bodySmall),
              ],
            ),
          ),
          TextButton(
            // Step 1: a tap marks the praise as sent (the sending is wired later).
            onPressed: _sent ? null : () => setState(() => _sent = true),
            style: TextButton.styleFrom(minimumSize: const Size(IgongoTouch.minimum, IgongoTouch.minimum)),
            child: Text(_sent ? 'Thank You!' : 'Send Praise'),
          ),
        ],
      ),
    );
  }
}
