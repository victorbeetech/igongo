// S00-31 My profile ("Me"): who is signed in, the app's look, and the two
// account actions every person needs: sign out, and delete my own account
// (guests; staff accounts are closed by HR, and the server refuses them).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/dialogs/igongo_dialog.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../../shared/ui/section/section_header.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';

/// The person's own profile and account actions.
class MyProfileScreen extends ConsumerWidget {
  /// Creates the profile for [screen].
  const MyProfileScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Asks, then signs out and returns to the sign-in screen.
  Future<void> _signOut(BuildContext context, WidgetRef ref) async {
    if (!await _confirm(context, _signOutDialog)) return;
    await ref.read(sessionProvider.notifier).signOut();
    if (context.mounted) screen.open('S00-05');
  }

  /// Asks, then deletes the account; the server's refusal shows as a toast.
  Future<void> _delete(BuildContext context, WidgetRef ref) async {
    if (!await _confirm(context, _deleteDialog)) return;
    try {
      await ref.read(sessionProvider.notifier).deleteMyAccount();
      if (context.mounted) screen.open('S00-05');
    } on ApiException catch (e) {
      if (context.mounted) showIgongoToast(context, e.message);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider).valueOrNull;
    return ScreenListView(
      children: [
        // Step 1: who is signed in, or a way to sign in.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: session == null
              ? IgongoButton(
                  label: 'Sign in or create an account',
                  expand: true,
                  onPressed: () => screen.open('S00-05'),
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(session.name.isEmpty ? 'Your account' : session.name, style: context.text.titleLarge),
                    if (session.email.isNotEmpty) Text(session.email, style: context.text.bodyMedium),
                    // The short profile number (00001), shown after the email.
                    if (session.displayId.isNotEmpty) Text('ID ${session.displayId}', style: context.text.bodySmall),
                    Text(session.isStaff ? 'Staff account' : 'Guest account', style: context.text.bodySmall),
                  ],
                ),
        ),
        // Step 2: the guest's own bookings and orders.
        if (session != null && !session.isStaff)
          IgongoListRow(
            title: 'My bookings and orders',
            leading: const Icon(Icons.receipt_long_outlined),
            onTap: () => screen.open('S54-05'),
          ),
        // Step 3: how the app looks.
        const SectionHeader('Display'),
        IgongoListRow(
          title: 'Theme',
          leading: const Icon(Icons.dark_mode_outlined),
          onTap: () => screen.open('S00-34'),
        ),
        IgongoListRow(title: 'Text size', leading: const Icon(Icons.text_fields), onTap: () => screen.open('S00-33')),
        // Step 4: the account actions.
        if (session != null) ...[
          const SectionHeader('Account'),
          IgongoListRow(
            title: 'Signed-in devices',
            leading: const Icon(Icons.devices_outlined),
            onTap: () => screen.open('S00-36'),
          ),
          IgongoListRow(title: 'Sign out', leading: const Icon(Icons.logout), onTap: () => _signOut(context, ref)),
          if (!session.isStaff)
            IgongoListRow(
              title: 'Delete my account',
              leading: const Icon(Icons.delete_outline),
              onTap: () => _delete(context, ref),
            ),
        ],
      ],
    );
  }
}

/// Shows [dialog] and completes with true when the person confirms.
Future<bool> _confirm(BuildContext context, DialogSpec dialog) async {
  var yes = false;
  await showDialog<void>(
    context: context,
    builder: (_) => IgongoDialog(dialog: dialog, onConfirm: () => yes = true),
  );
  return yes;
}

const _signOutDialog = DialogSpec(
  id: 'D00-sign-out',
  name: 'Sign out?',
  purpose: 'You will need your email and password to sign in again on this phone.',
  slug: 'sign-out',
  tone: DialogTone.confirm,
);

const _deleteDialog = DialogSpec(
  id: 'D00-delete-account',
  name: 'Delete your account?',
  purpose:
      'Your account and sign-in methods are removed for good. Receipts the hotel must keep by law stay with the hotel.',
  slug: 'delete-account',
  tone: DialogTone.danger,
);
