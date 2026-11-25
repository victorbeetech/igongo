// Runs before every test file: loads the real fonts (Lato, Cinzel and the
// icon font), so golden images show the brand type instead of grey boxes.

import 'dart:async';

import 'support/load_fonts.dart';

/// Flutter calls this around each test file's main().
Future<void> testExecutable(FutureOr<void> Function() testMain) async {
  await loadAppFonts();
  await testMain();
}
