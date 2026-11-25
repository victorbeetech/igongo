// A comment under a post.

import '../../../shared/api/api_client.dart';

/// A comment.
class NoticeComment {
  /// Creates a comment.
  const NoticeComment({required this.authorName, required this.body});

  /// Reads one from the API's JSON.
  factory NoticeComment.fromJson(Json json) =>
      NoticeComment(authorName: '${json['authorName']}', body: '${json['body']}');

  /// Who wrote it.
  final String authorName;

  /// What they wrote.
  final String body;
}
