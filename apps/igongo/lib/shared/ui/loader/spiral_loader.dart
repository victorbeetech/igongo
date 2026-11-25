// The brand loader: the Igongo spiral turning. It stops turning when the
// phone's reduce motion setting is on.

import 'package:flutter_svg/flutter_svg.dart';
import 'package:igongo_brand/igongo_brand.dart';
import 'package:material_ui/material_ui.dart';

/// The turning Igongo spiral, used wherever something is loading.
class SpiralLoader extends StatefulWidget {
  /// Creates a loader of the given [size].
  const SpiralLoader({super.key, this.size = 36});

  /// Width and height in logical pixels.
  final double size;

  @override
  State<SpiralLoader> createState() => _SpiralLoaderState();
}

class _SpiralLoaderState extends State<SpiralLoader> with SingleTickerProviderStateMixin {
  // One turn every 1.2 seconds, the same speed as the kit's animated loader.
  late final _turns = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat();

  @override
  void dispose() {
    _turns.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Step 1: respect reduce motion by showing the spiral still.
    final still = MediaQuery.disableAnimationsOf(context);
    final spiral = SvgPicture.asset(BrandAssets.spiralRed, package: BrandAssets.package, width: widget.size);
    // Step 2: otherwise turn it, and tell screen readers what is happening.
    return Semantics(
      label: 'Loading',
      child: still ? spiral : RotationTransition(turns: _turns, child: spiral),
    );
  }
}
