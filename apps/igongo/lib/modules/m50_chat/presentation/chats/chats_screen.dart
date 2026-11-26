// S50-01 Chats, live: my chats with unread counts; guests also see the
// desks they can write to. Tapping a chat opens it.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/chat_providers.dart';
import '../../domain/conversation.dart';
import '../../domain/desk.dart';
import '../room/chat_room_screen.dart';

/// My chats.
class ChatsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const ChatsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Opens the chat [id] named [name].
  void _open(BuildContext context, String id, String name) => Navigator.of(context).push(
    MaterialPageRoute<void>(
      builder: (_) => ChatRoomScreen(id: id, name: name),
    ),
  );

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<(List<Conversation>, List<Desk>)>(
    screenName: screen.spec.name,
    value: ref.watch(chatsProvider),
    onRetry: () => ref.invalidate(chatsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, data, _) {
      final (chats, desks) = data;
      return RefreshIndicator(
        onRefresh: () => ref.refresh(chatsProvider.future),
        child: ScreenListView(
          children: [
            PurposeText(screen.spec.purpose),
            for (final d in desks)
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.sm),
                child: IgongoButton(
                  label: 'Write to ${d.name}',
                  variant: ButtonVariant.secondary,
                  expand: true,
                  onPressed: () async {
                    try {
                      final id = await ref.read(chatApiProvider).openDesk(d.key);
                      if (context.mounted) _open(context, id, d.name);
                    } on Exception catch (e) {
                      if (context.mounted) showIgongoToast(context, '$e');
                    }
                  },
                ),
              ),
            if (chats.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No chats yet.')),
            for (final c in chats)
              IgongoListRow(
                title: c.name,
                subtitle: c.lastPreview,
                status: c.unread > 0 ? '${c.unread} new' : null,
                onTap: () => _open(context, c.id, c.name),
              ),
          ],
        ),
      );
    },
  );
}
