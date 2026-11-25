// Loads every font the app bundles (the brand kit's Lato and Cinzel, and the
// Material icon font) into the test engine, which otherwise draws every
// letter as a box. Reads the same font list the app ships with.

import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

/// Loads every family listed in the app's FontManifest.json.
Future<void> loadAppFonts() async {
  TestWidgetsFlutterBinding.ensureInitialized();
  // Step 1: the list of families and their files, as bundled with the app.
  final manifest = jsonDecode(await rootBundle.loadString('FontManifest.json')) as List<dynamic>;
  for (final entry in manifest.cast<Map<String, dynamic>>()) {
    // Step 2: every file of the family, loaded under the family's own name.
    final loader = FontLoader(entry['family'] as String);
    for (final font in (entry['fonts'] as List<dynamic>).cast<Map<String, dynamic>>()) {
      loader.addFont(rootBundle.load(font['asset'] as String));
    }
    await loader.load();
  }
}
