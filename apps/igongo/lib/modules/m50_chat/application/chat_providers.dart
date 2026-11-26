// Chat live data for the app (Riverpod).

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../shared/session/session_controller.dart';
import '../data/chat_api.dart';
import '../domain/chat_message.dart';
import '../domain/conversation.dart';
import '../domain/desk.dart';

/// The Chat API on the app's client.
final chatApiProvider = Provider((ref) => ChatApi(ref.watch(apiClientProvider)));

/// My chats and the desks I can write to.
final chatsProvider = FutureProvider.autoDispose<(List<Conversation>, List<Desk>)>((ref) async {
  ref.watch(sessionProvider);
  final api = ref.watch(chatApiProvider);
  return (await api.conversations(), await api.desks());
});

/// One chat's messages.
final messagesProvider = FutureProvider.autoDispose.family<List<ChatMessage>, String>((ref, id) {
  ref.watch(sessionProvider);
  return ref.watch(chatApiProvider).messages(id);
});
