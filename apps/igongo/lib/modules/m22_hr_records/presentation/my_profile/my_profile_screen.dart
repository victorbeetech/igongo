// S22-08 My profile at work, live: what HR holds about me. Changes go
// through HR, so the screen only reads. Signed out, the prototype shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/live/live_view.dart';
import '../../../../shared/screens/parts/purpose_text.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/screens/screen_layout.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../application/hr_providers.dart';
import '../../domain/my_profile.dart';

/// My profile at work.
class MyProfileScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const MyProfileScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<MyProfile>(
    screenName: screen.spec.name,
    value: ref.watch(myProfileProvider),
    onRetry: () => ref.invalidate(myProfileProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, p, _) => ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Who I am at work, then each field HR holds ("Not set" when empty).
        IgongoListRow(
          title: p.staff.name,
          subtitle: p.staff.line,
          status: p.status,
          leading: const Icon(Icons.badge_outlined),
        ),
        for (final (label, value, icon) in [
          ('Phone', p.phone, Icons.phone_outlined),
          ('Email', p.email, Icons.mail_outline),
          ('Started', p.hireDate, Icons.event_outlined),
          ('Emergency contact', p.emergencyContact, Icons.contact_emergency_outlined),
        ])
          IgongoListRow(title: label, subtitle: value ?? 'Not set', leading: Icon(icon)),
        const IgongoListRow(title: 'Something wrong?', subtitle: 'Ask HR to change it.'),
      ],
    ),
  );
}
