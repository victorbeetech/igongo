// The Notice Board's live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/notices_api.dart';
import '../domain/board_page.dart';
import '../domain/post_page.dart';

/// The Notice Board API on the app's client.
final noticesApiProvider = Provider((ref) => NoticesApi(ref.watch(apiClientProvider)));

/// The board.
final boardProvider = FutureProvider.autoDispose<BoardPage>((ref) {
  ref.watch(sessionProvider);
  return ref.watch(noticesApiProvider).board();
});

/// One post, by ID.
final postProvider = FutureProvider.autoDispose.family<PostPage, String>((ref, id) {
  ref.watch(sessionProvider);
  return ref.watch(noticesApiProvider).post(id);
});
