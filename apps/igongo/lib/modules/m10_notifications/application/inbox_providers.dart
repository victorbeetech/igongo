// Live Alerts inbox data (Riverpod). Each read asks the API again, so a
// mark-as-read shows at once after the list is refreshed.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/inbox_api.dart';
import '../domain/inbox_page.dart';

/// The inbox calls on the app's client.
final inboxApiProvider = Provider((ref) => InboxApi(ref.watch(apiClientProvider)));

/// The first page of the person's inbox. Auto-disposed, so leaving the screen forgets it.
final inboxProvider = FutureProvider.autoDispose<InboxPage>(
  (ref) => ref.watch(inboxApiProvider).fetchFirstPage(),
);
