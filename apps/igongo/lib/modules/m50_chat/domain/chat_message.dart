// One chat message.

import '../../../shared/api/api_client.dart';

/// A message.
class ChatMessage {
  /// Creates a message.
  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.body,
    required this.at,
  });

  /// Reads one from the API's JSON.
  factory ChatMessage.fromJson(Json json) => ChatMessage(
    id: '${json['id']}',
    senderId: '${json['senderId']}',
    senderName: '${json['senderName']}',
    body: '${json['body']}',
    at: DateTime.parse('${json['at']}'),
  );

  /// Its ID.
  final String id;

  /// The sender's account ID.
  final String senderId;

  /// The sender's name.
  final String senderName;

  /// What they wrote.
  final String body;

  /// When.
  final DateTime at;
}
