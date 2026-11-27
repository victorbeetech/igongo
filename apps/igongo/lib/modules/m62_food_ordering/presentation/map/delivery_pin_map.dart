// The delivery-pin map seam. The checkout uses only [DeliveryPinMap]; when the
// map key is missing it shows [MapNotReadyNotice], so the guest can still type
// their place. When the map package is added, only this file changes.

import 'package:flutter/material.dart';
import 'package:igongo_tokens/igongo_tokens.dart';

import '../../domain/delivery_pin.dart';

/// Lets the guest pick a delivery point on a map. Reports the chosen pin through [onPinned].
class DeliveryPinMap extends StatelessWidget {
  /// Creates the map with the current [pin] (or null) and the pin-chosen callback.
  const DeliveryPinMap({super.key, required this.pin, required this.onPinned});

  /// The pin already chosen, shown on the map, or null.
  final DeliveryPin? pin;

  /// Called with the new pin when the guest taps a point on the map.
  final ValueChanged<DeliveryPin> onPinned;

  @override
  Widget build(BuildContext context) {
    // The map itself is added with the map package once the owner's key is in
    // (see map_setup.dart and docs/NEEDS-YOU.md). Until then, say so plainly.
    return const MapNotReadyNotice();
  }
}

/// The notice shown in place of the map until the owner's key is set.
class MapNotReadyNotice extends StatelessWidget {
  /// Creates the notice.
  const MapNotReadyNotice({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: IgongoSpace.sm),
      child: Text(
        'The map is not set up yet. Type where to deliver and we will still send it to the right place.',
        style: theme.textTheme.bodySmall,
      ),
    );
  }
}
