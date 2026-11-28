// The three-step progress bar used by booking review, guest details and
// payment: a step badge, the step label, a progress track and step names.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';

/// Shows where the guest is in the three checkout steps (1 to 3).
class CheckoutStepBar extends StatelessWidget {
  /// Creates the bar for [step] (1, 2 or 3) with its [stepName].
  const CheckoutStepBar({super.key, required this.step, required this.stepName});

  /// The current step, from 1 to 3.
  final int step;

  /// The name of the current step, shown on the right.
  final String stepName;

  /// The three step names, in order.
  static const List<String> _names = ['Order review', 'Guest details', 'Payment'];

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Step 1: the badge and "Step n of 3" on the left, the step name on the right.
        Row(
          children: [
            CircleAvatar(
              radius: 12,
              backgroundColor: palette.primary,
              child: Text('$step', style: context.text.labelMedium?.copyWith(color: palette.onPrimary)),
            ),
            const SizedBox(width: IgongoSpace.sm),
            Text('Step $step of 3', style: context.text.labelLarge?.copyWith(color: palette.primary)),
            const Spacer(),
            Text(stepName.toUpperCase(), style: context.text.labelSmall?.copyWith(color: palette.accent)),
          ],
        ),
        const SizedBox(height: IgongoSpace.sm),
        // Step 2: the track, filled up to the current step.
        ClipRRect(
          borderRadius: BorderRadius.circular(IgongoRadius.pill),
          child: LinearProgressIndicator(
            value: step / 3,
            minHeight: 6,
            backgroundColor: palette.border,
            color: palette.accent,
          ),
        ),
        const SizedBox(height: IgongoSpace.xs),
        // Step 3: the three step names, the current one in red.
        Row(
          children: [
            for (var i = 0; i < _names.length; i++)
              Expanded(
                child: Text(
                  '${i + 1}. ${_names[i]}',
                  textAlign: i == 0 ? TextAlign.left : (i == 1 ? TextAlign.center : TextAlign.right),
                  style: context.text.labelSmall?.copyWith(
                    color: i + 1 == step ? palette.primary : palette.textMuted,
                    fontWeight: i + 1 == step ? FontWeight.w700 : FontWeight.w400,
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
