// The delivery-pin map: the guest taps a point and the checkout receives its
// latitude and longitude. Draws OpenStreetMap tiles through MapLibre (see
// map_setup.dart for the tile setting).

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:material_ui/material_ui.dart';

import '../../domain/delivery_pin.dart';
import 'map_setup.dart';

/// Lets the guest pick a delivery point on a map. Reports each tapped point through [onPinned].
class DeliveryPinMap extends StatefulWidget {
  /// Creates the map with the current [pin] (or null) and the tap callback.
  const DeliveryPinMap({super.key, required this.pin, required this.onPinned});

  /// The pin already chosen, shown on the map, or null.
  final DeliveryPin? pin;

  /// Called with the latitude and longitude of each tapped point.
  final void Function(double lat, double lng) onPinned;

  @override
  State<DeliveryPinMap> createState() => _DeliveryPinMapState();
}

class _DeliveryPinMapState extends State<DeliveryPinMap> {
  /// The map's controller, set once the map has been created.
  MapLibreMapController? _controller;

  /// False until the map's style has loaded, so the spinner shows meanwhile.
  bool _ready = false;

  @override
  void didUpdateWidget(covariant DeliveryPinMap oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Step 1: when the chosen pin changes, redraw its dot on the map.
    if (oldWidget.pin != widget.pin) _drawPin();
  }

  /// Keeps the controller for later drawing.
  void _onMapCreated(MapLibreMapController controller) => _controller = controller;

  /// The style is ready: show the map and draw the chosen pin.
  void _onStyleLoaded() {
    setState(() => _ready = true);
    _drawPin();
  }

  /// Passes a tapped point to the checkout.
  void _onTap(Object _, LatLng at) => widget.onPinned(at.latitude, at.longitude);

  /// Clears the old dot and draws one at the chosen pin, in the brand colour.
  Future<void> _drawPin() async {
    // Step 1: nothing to draw until the map exists.
    final controller = _controller;
    if (controller == null) return;
    // Step 2: read the theme's primary colour (the Igongo red) before any await, as hex text.
    final color = Theme.of(context).colorScheme.primary;
    final hex = '#${(color.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0')}';
    await controller.clearCircles();
    // Step 3: no pin chosen yet, so the map stays clean.
    final pin = widget.pin;
    if (pin == null) return;
    // Step 4: draw a dot at the chosen point.
    await controller.addCircle(CircleOptions(geometry: LatLng(pin.lat, pin.lng), circleColor: hex, circleRadius: 10, circleStrokeColor: '#FFFFFF', circleStrokeWidth: 2));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // The map area: a spinner until the tiles' style has loaded.
        SizedBox(
          height: 240,
          child: Stack(
            children: [
              MapLibreMap(
                styleString: mapStyle,
                initialCameraPosition: const CameraPosition(target: kMapStartPoint, zoom: kMapStartZoom),
                onMapCreated: _onMapCreated,
                onStyleLoadedCallback: _onStyleLoaded,
                onMapClick: _onTap,
              ),
              if (!_ready) const Center(child: CircularProgressIndicator()),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.only(top: IgongoSpace.xs),
          child: Text(
            'Tap the map to set the exact spot. The map needs internet; you can always type the place instead.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ),
      ],
    );
  }
}
