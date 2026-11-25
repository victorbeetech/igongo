// One post with its comments (`GET /api/notices/:id`).

import '../../../shared/api/api_client.dart';
import 'notice.dart';
import 'notice_comment.dart';

/// A post and its comments.
class PostPage {
  /// Creates it.
  const PostPage({required this.notice, required this.comments, required this.likes});

  /// Reads it from the API's JSON.
  factory PostPage.fromJson(Json json) => PostPage(
    notice: Notice.fromJson(json['notice'] as Json),
    comments: [for (final c in json['comments'] as List<dynamic>) NoticeComment.fromJson(c as Json)],
    likes: (json['likes'] as num?)?.toInt() ?? 0,
  );

  /// The post.
  final Notice notice;

  /// Its comments, oldest first.
  final List<NoticeComment> comments;

  /// How many likes.
  final int likes;
}
