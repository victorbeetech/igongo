// The app's clock: every screen that needs "now" for a greeting reads it from
// here, so tests can pin the time and screenshots never change with the hour.

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Returns the current time. The app uses the real clock; tests override this
/// provider to pin a fixed time.
final clockProvider = Provider<DateTime Function()>((ref) => DateTime.now);
