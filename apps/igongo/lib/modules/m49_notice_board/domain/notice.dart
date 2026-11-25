// A notice board post, as the API returns it on the board list and detail.

import '../../../shared/api/api_client.dart';

/// A post.
class Notice {
  /// Creates a post.
  const Notice({
    required this.id,
    required this.title,
    required this.body,
    required this.authorName,
    required this.createdAt,
    required this.pinned,
    required this.allowLikes,
    required this.allowComments,
    this.likes = 0,
    this.comments = 0,
    this.likedByMe = false,
    this.readByMe = true,
  });

  /// Reads one from the API's JSON.
  factory Notice.fromJson(Json json) => Notice(
    id: '${json['id']}',
    title: '${json['title']}',
    body: '${json['body']}',
    authorName: '${json['authorName']}',
    createdAt: DateTime.parse('${json['createdAt']}').toLocal(),
    pinned: json['pinned'] == true,
    allowLikes: json['allowLikes'] != false,
    allowComments: json['allowComments'] != false,
    likes: (json['likes'] as num?)?.toInt() ?? 0,
    comments: (json['comments'] as num?)?.toInt() ?? 0,
    likedByMe: json['likedByMe'] == true,
    readByMe: json['readByMe'] != false,
  );

  /// The post's ID.
  final String id;

  /// The headline.
  final String title;

  /// The message.
  final String body;

  /// Who posted it.
  final String authorName;

  /// When it was posted.
  final DateTime createdAt;

  /// Shown at the top.
  final bool pinned;

  /// The post takes likes (the board switch must be on too).
  final bool allowLikes;

  /// The post takes comments (the board switch must be on too).
  final bool allowComments;

  /// How many likes.
  final int likes;

  /// How many comments.
  final int comments;

  /// I liked it.
  final bool likedByMe;

  /// I opened it before.
  final bool readByMe;
}
