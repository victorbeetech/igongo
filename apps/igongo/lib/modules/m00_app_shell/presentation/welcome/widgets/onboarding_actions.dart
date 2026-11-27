// The two buttons at the foot of an onboarding screen: the main action as a
// filled button, and the second choice as an outlined button.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/ui/button/igongo_button.dart';

/// The main action and the second choice, stacked full width.
class OnboardingActions extends StatelessWidget {
  /// Creates the pair. Icons are optional.
  const OnboardingActions({
    super.key,
    required this.primaryLabel,
    required this.onPrimary,
    required this.secondaryLabel,
    required this.onSecondary,
    this.primaryIcon,
    this.secondaryIcon,
  });

  /// The words on the filled button.
  final String primaryLabel;

  /// What the filled button does.
  final VoidCallback onPrimary;

  /// The words on the outlined button.
  final String secondaryLabel;

  /// What the outlined button does.
  final VoidCallback onSecondary;

  /// An optional icon on the filled button.
  final IconData? primaryIcon;

  /// An optional icon on the outlined button.
  final IconData? secondaryIcon;

  @override
  Widget build(BuildContext context) {
    // Step 1: the filled button first, then the outlined one, with the token gap between.
    return Column(
      spacing: IgongoSpace.sm,
      children: [
        IgongoButton(label: primaryLabel, icon: primaryIcon, onPressed: onPrimary, expand: true),
        IgongoButton(
          label: secondaryLabel,
          icon: secondaryIcon,
          onPressed: onSecondary,
          variant: ButtonVariant.secondary,
          expand: true,
        ),
      ],
    );
  }
}
