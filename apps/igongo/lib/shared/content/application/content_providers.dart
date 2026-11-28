// Riverpod providers for the guest content. Screens watch these; nothing is hard-coded.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../session/session_controller.dart';
import '../data/content_api.dart';
import '../domain/guest_content.dart';

/// The content API, on the app's API client.
final contentApiProvider = Provider((ref) => ContentApi(ref.watch(apiClientProvider)));

/// The guest content the app shows. Reloads when the app asks for it (e.g. pull to refresh).
final guestContentProvider = FutureProvider.autoDispose<GuestContent>((ref) => ref.watch(contentApiProvider).content());
