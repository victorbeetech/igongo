// Free map settings for the delivery pin. No key and no card are needed.
//
// The map draws OpenStreetMap tiles through MapLibre. The tile address below
// is the one named setting to change later (for example, to a paid map once
// the hotel's card is ready): change [kMapTileUrl] and [kMapAttribution] here
// and the whole app follows. See docs/NEEDS-YOU.md.

import 'dart:convert';

import 'package:maplibre_gl/maplibre_gl.dart';

/// The tile address the map draws from. `{z}`, `{x}` and `{y}` are filled in by the map.
const String kMapTileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

/// The credit shown on the map, as the tile provider requires.
const String kMapAttribution = '© OpenStreetMap contributors';

/// Where the map opens before the guest taps a point: the centre of Kampala.
const LatLng kMapStartPoint = LatLng(0.3476, 32.5825);

/// The starting zoom level (street level).
const double kMapStartZoom = 14;

/// The map style: one raster layer built from [kMapTileUrl].
String get mapStyle => jsonEncode({
  'version': 8,
  'sources': {
    'base': {'type': 'raster', 'tiles': [kMapTileUrl], 'tileSize': 256, 'attribution': kMapAttribution},
  },
  'layers': [
    {'id': 'base', 'type': 'raster', 'source': 'base'},
  ],
});
