// Draws a screen's non-normal states: loading, empty, error, permission
// denied and success. Offline is a banner over the normal content instead,
// because saved items still show when the network is lost.

import 'package:material_ui/material_ui.dart';

import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';
import '../ui/message/state_message.dart';
import '../ui/skeleton/skeleton_list.dart';
import 'view_state.dart';

/// The body for [state] on the screen called [screenName].
class StateView extends StatelessWidget {
  /// Creates the state body. [onBack] leaves the screen; [onRetry] tries again.
  const StateView({super.key, required this.state, required this.screenName, this.onBack, this.onRetry});

  /// Which state to draw.
  final ViewState state;

  /// The screen's name, used in the messages.
  final String screenName;

  /// Leaves the screen.
  final VoidCallback? onBack;

  /// Tries again after an error.
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final back = IgongoButton(label: 'Back', variant: ButtonVariant.secondary, onPressed: onBack);
    // One message per state, with the actions the wireframes asked for.
    return switch (state) {
      ViewState.loading => const SkeletonList(),
      ViewState.empty => StateMessage(
        icon: Icons.inbox_outlined,
        title: 'Nothing here yet',
        message: '${screenName.toLowerCase()} will appear here. Add the first one to get started.',
        actions: [IgongoButton(label: 'Add the first one', icon: Icons.add, onPressed: onRetry)],
      ),
      ViewState.error => StateMessage(
        icon: Icons.error_outline,
        colour: p.error,
        title: 'Something went wrong',
        message: "We couldn't load $screenName. Check your connection and try again, or report it.",
        actions: [
          IgongoButton(label: 'Try again', icon: Icons.refresh, onPressed: onRetry),
          back,
        ],
      ),
      ViewState.denied => StateMessage(
        icon: Icons.lock_outline,
        colour: p.warning,
        title: "Your role can't open this",
        message: 'Ask your head of department or the super admin to give your role access to $screenName.',
        actions: [back],
      ),
      ViewState.success => StateMessage(
        icon: Icons.check_circle_outline,
        colour: p.success,
        title: 'Done',
        message: 'Saved and sent. Everyone who needs to know has been told.',
        actions: [IgongoButton(label: 'Done', onPressed: onBack)],
      ),
      // Normal and offline draw the screen's own content, so they never reach here.
      ViewState.normal || ViewState.offline => const SizedBox.shrink(),
    };
  }
}
