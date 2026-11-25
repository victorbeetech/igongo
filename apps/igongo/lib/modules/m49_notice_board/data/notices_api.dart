// The Notice Board endpoints the app uses (`/api/notices`).

import '../../../shared/api/api_client.dart';
import '../domain/board_page.dart';
import '../domain/post_page.dart';

/// Calls the Notice Board API.
class NoticesApi {
  /// Creates the calls on [_api].
  const NoticesApi(this._api);

  final ApiClient _api;

  /// The board (S49-01).
  Future<BoardPage> board() async => BoardPage.fromJson(await _api.get('/api/notices?limit=50'));

  /// One post; opening it marks it read (S49-02).
  Future<PostPage> post(String id) async => PostPage.fromJson(await _api.get('/api/notices/$id'));

  /// Likes or unlikes a post.
  Future<void> toggleLike(String id) => _api.post('/api/notices/$id/like');

  /// Comments on a post.
  Future<void> comment(String id, String body) => _api.post('/api/notices/$id/comments', {'body': body});
}
