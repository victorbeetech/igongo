// A chat in my list, with who is in it and how many messages I have not read.

import '../../../shared/api/api_client.dart';

/// A chat.
class Conversation {
  /// Creates a chat.
  const Conversation({
    required this.id,
    required this.title,
    required this.memberNames,
    required this.lastPreview,
    required this.unread,
  });

  /// Reads one from the API's JSON.
  factory Conversation.fromJson(Json json) => Conversation(
    id: '${json['id']}',
    title: json['title'] as String?,
    memberNames: [for (final m in (json['members'] as List?) ?? const []) '${(m as Json)['name']}'],
    lastPreview: json['lastPreview'] as String?,
    unread: (json['unread'] as num?)?.toInt() ?? 0,
  );

  /// Its ID.
  final String id;

  /// A group's or desk's name; null for one-to-one chats.
  final String? title;

  /// The other people in it.
  final List<String> memberNames;

  /// The start of the last message.
  final String? lastPreview;

  /// Messages I have not read.
  final int unread;

  /// What to call it.
  String get name => title ?? (memberNames.isEmpty ? 'Chat' : memberNames.join(', '));
}
