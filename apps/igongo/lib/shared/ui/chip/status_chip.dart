// A small pill with a status word, coloured by its tone, with a dot so it
// does not rely on colour alone.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import 'status_tone.dart';

export 'status_tone.dart';

/// A status pill such as "Paid" or "Blocked".
class StatusChip extends StatelessWidget {
  /// Creates a chip for [status]. The tone is worked out from the word.
  const StatusChip(this.status, {super.key});

  /// The status word.
  final String status;

  @override
  Widget build(BuildContext context) {
    // Step 1: the tone's colour from the palette.
    final p = context.palette;
    final colour = switch (StatusTone.of(status)) {
      StatusTone.success => p.success,
      StatusTone.warning => p.warning,
      StatusTone.error => p.error,
      StatusTone.info => p.info,
      StatusTone.neutral => p.textMuted,
    };
    // Step 2: a tinted pill with a dot and the word.
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: colour.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(99)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: 4,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: colour, shape: BoxShape.circle),
          ),
          Text(
            status,
            style: context.text.labelSmall?.copyWith(color: colour, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
