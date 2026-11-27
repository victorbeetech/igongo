// The row at the top of each onboarding screen: a label (or Back) on the left
// and Skip on the right. Skip is always there, so the person can leave at once.

import 'package:material_ui/material_ui.dart';

import '../../../../../shared/ui/button/igongo_button.dart';

/// The top row of an onboarding screen.
class OnboardingTopBar extends StatelessWidget {
  /// Creates the row with [leading] on the left and Skip, which runs [onSkip], on the right.
  const OnboardingTopBar({super.key, required this.leading, required this.onSkip});

  /// What sits on the left: a label, or a label with a Back button.
  final Widget leading;

  /// What Skip does.
  final VoidCallback onSkip;

  @override
  Widget build(BuildContext context) {
    // Step 1: the leading item on the left, and the Skip text button pushed to the right.
    return Row(
      children: [
        leading,
        const Spacer(),
        IgongoButton(label: 'Skip', variant: ButtonVariant.text, onPressed: onSkip),
      ],
    );
  }
}
