// One fault with its comments and like count (the detail screen).

import '../../../shared/api/api_client.dart';
import '../../../shared/social/comment.dart';
import 'fault.dart';

/// A fault's detail.
class FaultPage {
  /// Creates the page.
  const FaultPage({
    required this.fault,
    required this.comments,
    required this.likes,
    required this.likesOn,
    required this.commentsOn,
  });

  /// Reads it from `GET /api/faults/:id`.
  factory FaultPage.fromJson(Json json) {
    final settings = (json['settings'] as Json?) ?? const {};
    return FaultPage(
      fault: Fault.fromJson(json['fault'] as Json),
      comments: Comment.listOf(json['comments']),
      likes: (json['likes'] as num?)?.toInt() ?? 0,
      likesOn: settings['likesEnabled'] != false,
      commentsOn: settings['commentsEnabled'] != false,
    );
  }

  /// The fault.
  final Fault fault;

  /// Its comments.
  final List<Comment> comments;

  /// How many likes.
  final int likes;

  /// Likes are switched on.
  final bool likesOn;

  /// Comments are switched on.
  final bool commentsOn;
}
