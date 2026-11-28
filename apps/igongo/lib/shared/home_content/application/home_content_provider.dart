// The guest home's content, read once from the public settings and kept for the
// session. If the server cannot be reached, the home shows [HomeContent.fallback].

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../api/api_client.dart';
import '../../session/session_controller.dart';
import '../domain/home_content.dart';

/// The "home" section of the public settings, as [HomeContent].
final homeContentProvider = FutureProvider<HomeContent>((ref) async {
  try {
    // Step 1: ask the public settings (no sign-in needed) for the home section.
    final settings = await ref.watch(apiClientProvider).get('/api/public/settings');
    // Step 2: read the section into the content the screens use.
    return HomeContent.fromJson(settings['home'] as Json?);
  } on Object {
    // Step 3: no answer from the server, so show the fallback content.
    return HomeContent.fallback;
  }
});
