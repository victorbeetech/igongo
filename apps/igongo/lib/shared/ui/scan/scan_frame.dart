// The target for an NFC tap or QR scan: a pulsing ring around the card icon.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// A pulsing ring that asks for a card, wristband or QR code.
class ScanFrame extends StatefulWidget {
  /// Creates the scan target with an instruction [label].
  const ScanFrame({super.key, this.label = 'Hold the card, wristband or QR code here'});

  /// What to do, shown under the ring.
  final String label;

  @override
  State<ScanFrame> createState() => _ScanFrameState();
}

class _ScanFrameState extends State<ScanFrame> with SingleTickerProviderStateMixin {
  // The ring breathes in and out every 1.6 seconds.
  late final _pulse = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600))
    ..repeat(reverse: true);

  @override
  void dispose() {
    _pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final still = MediaQuery.disableAnimationsOf(context);
    // Step 1: the ring, scaled by the pulse unless reduce motion is on.
    final ring = Container(
      width: 160,
      height: 160,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: p.primaryContainer,
        border: Border.all(color: p.primary, width: 3),
      ),
      child: Icon(Icons.contactless_outlined, size: 64, color: p.primary),
    );
    // Step 2: the instruction under it.
    return Column(
      spacing: 16,
      children: [
        still ? ring : ScaleTransition(scale: Tween(begin: 0.94, end: 1.04).animate(_pulse), child: ring),
        Text(widget.label, textAlign: TextAlign.center, style: context.text.titleSmall),
        Text('NFC or camera', style: context.text.bodySmall),
      ],
    );
  }
}
