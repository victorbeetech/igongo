// The Chat endpoints the app uses (`/api/chat`).

import '../../../shared/api/api_client.dart';
import '../domain/chat_message.dart';
import '../domain/conversation.dart';
import '../domain/desk.dart';

/// Calls the Chat API.
class ChatApi {
  /// Creates the calls on [_api].
  const ChatApi(this._api);

  final ApiClient _api;

  /// My chats (S50-01).
  Future<List<Conversation>> conversations() async {
    final json = await _api.get('/api/chat/conversations');
    return [for (final c in json['items'] as List) Conversation.fromJson(c as Json)];
  }

  /// The desks I can write to (guests).
  Future<List<Desk>> desks() async {
    final json = await _api.get('/api/chat/desks');
    return [for (final d in json['items'] as List) Desk.fromJson(d as Json)];
  }

  /// Opens my chat with a desk and returns its ID.
  Future<String> openDesk(String key) async => '${(await _api.post('/api/chat/desks/$key'))['id']}';

  /// A chat's messages, oldest first (S50-02).
  Future<List<ChatMessage>> messages(String id) async {
    final json = await _api.get('/api/chat/conversations/$id/messages?limit=200');
    return [for (final m in json['items'] as List) ChatMessage.fromJson(m as Json)];
  }

  /// Sends a message.
  Future<void> send(String id, String body) => _api.post('/api/chat/conversations/$id/messages', {'body': body});

  /// Marks the chat read.
  Future<void> markRead(String id) => _api.post('/api/chat/conversations/$id/read');
}
