// The signed-in person's layout (Riverpod). Null when signed out, so the
// menus fall back to the preview role from the catalog.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/layout_api.dart';
import '../domain/my_layout.dart';

/// The layout API.
final layoutApiProvider = Provider<LayoutApi>((ref) => LayoutApi(ref.watch(apiClientProvider)));

/// My layout; reloads when the session changes.
final myLayoutProvider = FutureProvider<MyLayout?>((ref) async {
  final session = ref.watch(sessionProvider).valueOrNull;
  if (session == null) return null;
  return ref.watch(layoutApiProvider).mine();
});
