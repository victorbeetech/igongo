// Draws a live API screen with the app's designed states. Two rules:
// - signed out: the screen's sample design shows (the clickable prototype,
//   which the tests and store screenshots also use);
// - signed in: loading, error, signed-out and denied use the same state
//   screens as the prototype, and the screen only writes the normal view.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:material_ui/material_ui.dart';

import '../api/api_exception.dart';
import '../session/session.dart';
import '../session/session_controller.dart';
import '../states/state_view.dart';
import '../states/view_state.dart';

/// The sample design when signed out, else the live data of [value].
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

  /// The prototype view, shown when nobody is signed in.
  final WidgetBuilder sample;

  /// The normal view, for loaded data and the signed-in person.
  final Widget Function(BuildContext context, T data, Session session) builder;

  /// Tries again after an error.
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(sessionProvider).valueOrNull;
    // Step 1: signed out shows the prototype.
    if (session == null) return sample(context);
    // Step 2: signed in shows the live states.
    return value.when(
      data: (data) => builder(context, data, session),
      loading: () => const StateView(state: ViewState.loading, screenName: ''),
      error: (error, _) => StateView(state: stateOf(error), screenName: screenName, onRetry: onRetry),
    );
  }

  /// The designed state for [error].
  static ViewState stateOf(Object error) {
    // Offline draws nothing in StateView (it is a banner elsewhere), so it shows as an error with Try again.
    return error is ApiException && error.denied ? ViewState.denied : ViewState.error;
  }
}
