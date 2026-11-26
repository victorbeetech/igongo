// Draws a live API screen with the app's designed states. Two rules:
// - the super admin's design preview (and the screen tests, signed out with
//   the preview on): the screen's sample design shows;
// - everyone else, signed in or not: the live data, with the designed
//   loading, error and denied states. A screen that needs an account asks a
//   signed-out visitor to sign in; public screens (rooms, menus) just load.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';

import '../api/api_exception.dart';
import '../preferences/preferences.dart';
import '../ui/button/igongo_button.dart';
import '../ui/message/state_message.dart';
import '../session/session.dart';
import '../session/session_controller.dart';
import '../states/state_view.dart';
import '../states/view_state.dart';

/// The sample design in the design preview, else the live data of [value].
class LiveView<T> extends ConsumerWidget {
  /// Creates the view. [sample] draws the prototype; [builder] draws loaded data.
  const LiveView({
    super.key,
    required this.screenName,
    required this.value,
    required this.sample,
    required this.builder,
    this.onRetry,
  });

  /// The screen's name, for the messages.
  final String screenName;

  /// The live data, watched from a provider.
  final AsyncValue<T> value;

  /// The sample view, shown only in the design preview.
  final WidgetBuilder sample;

  /// The normal view, for loaded data and the person (null when signed out).
  final Widget Function(BuildContext context, T data, Session? session) builder;

  /// Tries again after an error.
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider).valueOrNull;
    // Step 1: the design preview shows the sample (only ever with nobody, or the super admin, signed in).
    final preview = PreferencesScope.of(context).previewMode && (session == null || session.isSuperAdmin);
    if (preview) return sample(context);
    // Step 2: the live states; a screen that needs an account asks to sign in.
    return value.when(
      data: (data) => builder(context, data, session),
      loading: () => const StateView(state: ViewState.loading, screenName: ''),
      error: (error, _) => error is ApiException && error.needsSignIn
          ? StateMessage(
              icon: Icons.lock_outline,
              title: 'Sign in to see $screenName',
              message: 'Browsing is open to everyone. Your bookings, orders and account need you to sign in.',
              actions: [
                IgongoButton(
                  label: 'Sign in or create an account',
                  onPressed: () => GoRouter.of(context).push('/sign-in'),
                ),
              ],
            )
          : StateView(state: stateOf(error), screenName: screenName, onRetry: onRetry),
    );
  }

  /// The designed state for [error].
  static ViewState stateOf(Object error) {
    // Offline draws nothing in StateView (it is a banner elsewhere), so it shows as an error with Try again.
    return error is ApiException && error.denied ? ViewState.denied : ViewState.error;
  }
}
