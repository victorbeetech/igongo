// S00-31 My profile ("Me"), built to the guest design: the hotel banner with
// the theme and text size buttons, the guest's card with three stat tiles,
// the Resort Activity list, the Account & Security list, and the footer quote.
// For a guest the banner is also the app bar: it runs under the status bar.
// Staff accounts never see the activity rows, the stat tiles or delete.

import 'package:flutter/services.dart';
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
import '../../../m54_crm_guests/presentation/past_visits_screen.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import '../../../../shared/ui/card/igongo_card.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import 'profile_action_group.dart';
import 'profile_action_row.dart';
import 'profile_banner.dart';
import 'profile_card.dart';
import 'profile_footer.dart';
import 'profile_row_tone.dart';
import 'profile_section_title.dart';
import 'profile_stats.dart';
import 'profile_status_badge.dart';

/// Height of the red banner below the status bar, as in the design.
const _bannerBodyHeight = 190.0;

/// How far the profile card overlaps the bottom of the banner.
const _cardOverlap = 32.0;

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
    // Step 1: the banner height includes the status bar, so the card overlaps the same spot as the design.
    final bannerHeight = MediaQuery.paddingOf(context).top + _bannerBodyHeight;
    final list = ScreenListView(
      children: [
        // Step 1a: the banner, with the card (or the sign-in prompt) overlapping its lower edge.
        Stack(
          children: [
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: ProfileBanner(
                height: bannerHeight,
                onToggleTheme: () {
                  // Light and dark swap; the red stays the same in both.
                  final dark = Theme.of(context).brightness == Brightness.dark;
                  prefs.themeMode = dark ? ThemeMode.light : ThemeMode.dark;
                },
                onTextSize: () => screen.open('S00-33'),
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(IgongoSpace.lg, bannerHeight - _cardOverlap, IgongoSpace.lg, 0),
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
        // Step 2: the guest's activity: bookings, invoices, past visits and saved dishes.
        if (guest) ...[
          const ProfileSectionTitle('Resort Activity'),
          ProfileActionGroup(
            children: [
              // PLACEHOLDER: the room and the active stay count are not read yet; dashes show for now.
              ProfileActionRow(
                title: 'My Bookings & Orders',
                subtitle: 'Room — • — active stays',
                icon: Icons.event_available_outlined,
                tone: ProfileRowTone.solid,
                trailing: const ProfileStatusBadge(label: '— Active'),
                onTap: () => screen.open('S54-05'),
              ),
              ProfileActionRow(
                title: 'Folio & Digital Invoices',
                subtitle: 'UGX Billing & Statements',
                icon: Icons.receipt_long_outlined,
                onTap: () => screen.open('S78-06'),
              ),
              ProfileActionRow(
                title: 'Past Visits & Museum Tours',
                subtitle: 'Erijukiro Cultural Museum',
                icon: Icons.account_balance_outlined,
                onTap: () =>
                    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const PastVisitsScreen())),
              ),
              // PLACEHOLDER: the saved dishes screen and count are not built yet; the row is inert.
              ProfileActionRow(
                title: 'Saved Dishes',
                subtitle: 'Eshabwe, Tilapia & Luwombo',
                icon: Icons.restaurant_outlined,
                trailing: Text('— items', style: context.text.labelMedium?.copyWith(color: context.palette.textMuted)),
              ),
            ],
          ),
        ],
        // Step 3: the account actions, only when someone is signed in.
        if (session != null) ...[
          const ProfileSectionTitle('Account & Security'),
          ProfileActionGroup(
            children: [
              // PLACEHOLDER: the device list is not read yet; a dash shows for now.
              ProfileActionRow(
                title: 'Signed-in Devices',
                subtitle: '—',
                icon: Icons.smartphone_outlined,
                tone: ProfileRowTone.neutral,
                onTap: () => screen.open('S00-36'),
              ),
              ProfileActionRow(
                title: 'Sign Out',
                icon: Icons.logout,
                tone: ProfileRowTone.neutral,
                onTap: () => _signOut(context, ref),
              ),
              if (!session.isStaff)
                ProfileActionRow(
                  title: 'Delete Account',
                  icon: Icons.delete_outline,
                  tone: ProfileRowTone.danger,
                  chevron: false,
                  trailing: Text(
                    'Irreversible',
                    style: context.text.labelSmall?.copyWith(color: context.palette.error),
                  ),
                  onTap: () => _delete(context, ref),
                ),
            ],
          ),
        ],
        // Step 4: the heritage quote and the hotel line.
        const ProfileFooter(),
      ],
    );
    // Step 5: a guest's banner sits under the status bar, so its icons turn light (white on red).
    return guest ? AnnotatedRegion<SystemUiOverlayStyle>(value: SystemUiOverlayStyle.light, child: list) : list;
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
