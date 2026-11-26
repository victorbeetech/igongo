// A comment under a post, fault or checkup, as every module's API returns it.

import '../api/api_client.dart';

/// One comment.
class Comment {
  /// Creates a comment.
  const Comment({required this.id, required this.authorName, required this.body, required this.at});

  /// Reads one from the API's JSON.
  factory Comment.fromJson(Json json) => Comment(
    id: '${json['id']}',
    authorName: '${json['authorName']}',
    body: '${json['body']}',
    at: DateTime.parse('${json['at']}'),
  );

  /// Reads a list from [list] (a JSON array, or null).
  static List<Comment> listOf(Object? list) => [
    for (final c in (list as List?) ?? const []) Comment.fromJson(c as Json),
  ];

  /// The comment's ID.
  final String id;

  /// Who wrote it.
  final String authorName;

  /// What they wrote.
  final String body;

  /// When.
  final DateTime at;
}
