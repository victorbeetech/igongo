// The board as the app shows it: posts for me, and what my role and the
// board's switches let me do.

import '../../../shared/api/api_client.dart';
import 'notice.dart';

/// The notice board.
class BoardPage {
  /// Creates the board.
  const BoardPage({required this.posts, required this.canLike, required this.canComment});

  /// Reads it from the API's JSON.
  factory BoardPage.fromJson(Json json) {
    final settings = json['settings'] as Json? ?? const {};
    final can = json['can'] as Json? ?? const {};
    return BoardPage(
      posts: [for (final p in json['items'] as List<dynamic>) Notice.fromJson(p as Json)],
      canLike: can['like'] == true && settings['likesEnabled'] != false,
      canComment: can['comment'] == true && settings['commentsEnabled'] != false,
    );
  }

  /// Posts for me, pinned first.
  final List<Notice> posts;

  /// My role may like and likes are on.
  final bool canLike;

  /// My role may comment and comments are on.
  final bool canComment;
}
