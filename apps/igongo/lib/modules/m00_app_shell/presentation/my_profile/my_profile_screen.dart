// S00-31 My profile ("Me"): the guest's card over a hotel banner, three stat
// tiles, their activity, how the app looks, and the account actions.
// Behaviour of each row is unchanged: sign out and delete keep their
// confirmations, and staff accounts never see the activity rows or delete.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/api/api_exception.dart';
import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/dialogs/igongo_dialog.dart';
import '../../../../shared/preferences/preferences.dart';
import '../../../../shared/screens/parts/screen_list_view.dart';
import '../../../../shared/session/session_controller.dart';
import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import 'profile_action_row.dart';
import 'profile_banner.dart';
import 'profile_card.dart';
import 'profile_section_title.dart';
import 'profile_stats.dart';

/// Height of the red banner, wave included.
const _bannerHeight = 200.0;

/// Where the profile card starts: it overlaps the lower part of the banner.
const _cardTop = 140.0;

/// The label for each theme choice, as shown on this screen.
String _themeLabel(ThemeMode mode) => switch (mode) {
  ThemeMode.light => 'Light',
  ThemeMode.dark => 'Dark',
  ThemeMode.system => 'Follow the phone',
};

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
    final prefs = PreferencesScope.of(context);
    final guest = session != null && !session.isStaff;
    return ScreenListView(
      children: [
        // Step 1: the banner, with the card (or the sign-in prompt) overlapping its wavy edge.
        Stack(
          children: [
            const Positioned(top: 0, left: 0, right: 0, child: const ProfileBanner(height: _bannerHeight)),
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, _cardTop, IgongoSpace.lg, 0),
              child: session == null
                  ? _SignInPrompt(onSignIn: () => screen.open('S00-05'))
                  : Column(
                      spacing: IgongoSpace.md,
                      children: [
                        ProfileCard(
                          name: session.name,
                          email: session.email,
                          isStaff: session.isStaff,
                          onEdit: () => screen.open('S54-05'),
                        ),
                        // The guest's three numbers (staff do not get the tiles).
                        if (guest) const ProfileStats(),
                      ],
                    ),
            ),
          ],
        ),
        // Step 2: the guest's own activity: bookings and orders, receipts and past visits.
        if (guest) ...[
          const ProfileSectionTitle('My activity'),
          ProfileActionRow(
            title: 'My bookings and orders',
            icon: Icons.event_available_outlined,
            solid: true,
            onTap: () => screen.open('S54-05'),
          ),
          ProfileActionRow(
            title: 'Receipts',
            icon: Icons.receipt_long_outlined,
            solid: true,
            onTap: () => screen.open('S78-06'),
          ),
          ProfileActionRow(
            title: 'Past visits',
            icon: Icons.history,
            solid: true,
            onTap: () => screen.open('S54-05'),
          ),
        ],
        // Step 3: how the app looks, with the current theme shown on its row.
        const ProfileSectionTitle('Display'),
        ProfileActionRow(
          title: 'Theme',
          icon: Icons.dark_mode_outlined,
          value: _themeLabel(prefs.themeMode),
          onTap: () => screen.open('S00-34'),
        ),
        ProfileActionRow(title: 'Text size', icon: Icons.text_fields, onTap: () => screen.open('S00-33')),
        // Step 4: the account actions, only when someone is signed in.
        if (session != null) ...[
          const ProfileSectionTitle('Account'),
          ProfileActionRow(
            title: 'Signed-in devices',
            icon: Icons.devices_outlined,
            onTap: () => screen.open('S00-36'),
          ),
          ProfileActionRow(title: 'Sign out', icon: Icons.logout, onTap: () => _signOut(context, ref)),
          if (!session.isStaff)
            ProfileActionRow(
              title: 'Delete my account',
              icon: Icons.delete_outline,
              destructive: true,
              onTap: () => _delete(context, ref),
            ),
        ],
      ],
    );
  }
}

/// The card shown when nobody is signed in: a short line and the sign-in button.
class _SignInPrompt extends StatelessWidget {
  /// Creates the prompt.
  const _SignInPrompt({required this.onSignIn});

  /// Opens the sign-in screen.
  final VoidCallback onSignIn;

  @override
  Widget build(BuildContext context) => IgongoCard(
    padding: const EdgeInsets.all(IgongoSpace.lg),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: IgongoSpace.md,
      children: [
        Text('Sign in to see your bookings, orders and receipts.', style: context.text.bodyMedium),
        IgongoButton(label: 'Sign in or create an account', expand: true, onPressed: onSignIn),
      ],
    ),
  );
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
