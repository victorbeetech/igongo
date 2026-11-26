// S50-02 Chat room, live: the messages and a box to send. It checks for
// new messages every few seconds (until the realtime service is added) and
// marks the chat read when something new arrives.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/format/when.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/field/igongo_field.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/chat_providers.dart';
import '../../domain/chat_message.dart';

/// How often an open chat checks for new messages.
const _poll = Duration(seconds: 4);

/// One chat.
class ChatRoomScreen extends ConsumerStatefulWidget {
  /// Creates the screen for chat [id] called [name].
  const ChatRoomScreen({super.key, required this.id, required this.name});

  /// The chat's ID.
  final String id;

  /// What to call it.
  final String name;

  @override
  ConsumerState<ChatRoomScreen> createState() => _ChatRoomScreenState();
}

class _ChatRoomScreenState extends ConsumerState<ChatRoomScreen> {
  final _text = TextEditingController();
  Timer? _timer;
  String? _lastRead;

  @override
  void initState() {
    super.initState();
    // Step 1: ask for new messages every few seconds while the chat is open.
    _timer = Timer.periodic(_poll, (_) => ref.invalidate(messagesProvider(widget.id)));
  }

  @override
  void dispose() {
    _timer?.cancel();
    _text.dispose();
    super.dispose();
  }

  /// Marks the chat read once per newest message, not on every check.
  void _markRead(List<ChatMessage> messages) {
    if (messages.isEmpty || messages.last.id == _lastRead) return;
    _lastRead = messages.last.id;
    ref.read(chatApiProvider).markRead(widget.id).then((_) => ref.invalidate(chatsProvider), onError: (_) {});
  }

  /// Sends what is typed.
  Future<void> _send() async {
    final body = _text.text.trim();
    if (body.isEmpty) return;
    try {
      await ref.read(chatApiProvider).send(widget.id, body);
      _text.clear();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(messagesProvider(widget.id));
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text(widget.name)),
    body: Column(
      children: [
        Expanded(
          child: LiveView<List<ChatMessage>>(
            screenName: 'Chat',
            value: ref.watch(messagesProvider(widget.id)),
            onRetry: () => ref.invalidate(messagesProvider(widget.id)),
            sample: (_) => const SizedBox.shrink(),
            builder: (context, messages, session) {
              _markRead(messages);
              if (messages.isEmpty) return const Center(child: Text('No messages yet. Say hello.'));
              return ListView(
                reverse: true,
                padding: const EdgeInsets.all(IgongoSpace.lg),
                children: [
                  for (final m in messages.reversed)
                    Align(
                      alignment: m.senderId == session?.userId ? Alignment.centerRight : Alignment.centerLeft,
                      child: Card(
                        child: Padding(
                          padding: const EdgeInsets.all(IgongoSpace.sm),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${m.senderName} · ${dayTime(m.at)}', style: context.text.bodySmall),
                              Text(m.body),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(IgongoSpace.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              spacing: IgongoSpace.sm,
              children: [
                Expanded(
                  child: IgongoField(label: 'Message', controller: _text, onSubmitted: (_) => _send()),
                ),
                IgongoButton(label: 'Send', onPressed: _send),
              ],
            ),
          ),
        ),
      ],
    ),
  );
}
