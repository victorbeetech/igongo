// TEMPORARY render test: makes PNG pictures of the Sign in and Create account
// screens at a large and a small phone size, so they can be reviewed. It runs
// only when AUTH_RENDER is set, which the temporary auth-render workflow does.
// Remove this file with that workflow.

import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:igongo/app/catalog/catalog_index.dart';
import 'package:igongo/app/igongo_app.dart';
import 'package:material_ui/material_ui.dart';

import '../support/open_app.dart';

void main() {
  // Step 1: the render runs only in the temporary workflow, so normal test runs skip it.
  final skip = Platform.environment['AUTH_RENDER'] == null;

  // Step 2: each Auth screen, at a large and a small phone size, saved as one picture each.
  for (final (id, file) in [('S00-05', 'sign_in'), ('S00-18', 'create_account')]) {
    for (final (size, width, height) in [('large', 390.0, 844.0), ('small', 360.0, 640.0)]) {
      testWidgets('render $file $size', skip: skip, (tester) async {
        // Step 2a: a phone-sized window at 2x, as the golden tests use.
        usePhoneWindow(tester, width: width, height: height, ratio: 2);
        // Step 2b: open the screen with its location from the catalog.
        final screen = CatalogIndex.instance.screens[id]!;
        await openApp(tester, CatalogIndex.instance.locationOf(screen), mode: ThemeMode.light);
        // Step 2c: save the picture next to this test.
        await expectLater(find.byType(IgongoApp), matchesGoldenFile('goldens/render_${file}_$size.png'));
      });
    }
  }
}
