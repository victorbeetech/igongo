// S00-36 Active sessions: every phone and browser signed in to the person's
// account, live from the API, with Sign out on each one that is not this one.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_client.dart';
import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// One signed-in device.
typedef SignedInDevice = ({String id, String device, String since, bool current});

/// The person's signed-in devices.
final mySessionsProvider = FutureProvider.autoDispose<List<SignedInDevice>>((ref) async {
  ref.watch(sessionProvider);
  final json = await ref.watch(apiClientProvider).get('/api/users/me/sessions');
  return [
    for (final s in json['items'] as List<dynamic>)
      (
        id: '${(s as Json)['id']}',
        device: '${s['userAgent'] ?? 'Unknown device'}',
        since: '${s['createdAt'] ?? ''}'.split('T').first,
        current: s['current'] == true,
      ),
  ];
});

/// The active sessions screen.
class ActiveSessionsScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const ActiveSessionsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Signs out device [id].
  Future<void> _signOut(BuildContext context, WidgetRef ref, String id) async {
    try {
      await ref.read(apiClientProvider).send('DELETE', '/api/users/me/sessions/$id');
      if (context.mounted) showIgongoToast(context, 'Device signed out');
    } on ApiException catch (e) {
      if (context.mounted) showIgongoToast(context, e.message);
    }
    ref.invalidate(mySessionsProvider);
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<SignedInDevice>>(
    screenName: screen.spec.name,
    value: ref.watch(mySessionsProvider),
    onRetry: () => ref.invalidate(mySessionsProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, devices, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        for (final d in devices)
          IgongoListRow(
            title: d.device,
            subtitle: d.current ? 'This device, since ${d.since}' : 'Since ${d.since}. Tap to sign it out.',
            leading: const Icon(Icons.devices_outlined),
            onTap: d.current ? null : () => _signOut(context, ref, d.id),
          ),
        if (devices.isEmpty) const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No other devices.')),
      ],
    ),
  );
}
