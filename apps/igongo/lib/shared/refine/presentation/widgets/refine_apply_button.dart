// The Apply Filters button in the footer: deep red, with the results count in a small red badge.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// The main action of the filter: apply, and see how many results match.
class RefineApplyButton extends StatelessWidget {
  /// Creates the button for [resultCount] matching results. [onPressed] applies the filter.
  const RefineApplyButton({super.key, required this.resultCount, required this.onPressed});

  /// How many results the filter would show.
  final int resultCount;

  /// Called when the button is tapped.
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Material(
      color: palette.primaryDark,
      borderRadius: BorderRadius.circular(IgongoRadius.md),
      child: InkWell(
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        onTap: onPressed,
        child: SizedBox(
          height: IgongoTouch.preferred,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: IgongoSpace.sm,
            children: [
              Text(
                'Apply Filters',
                style: context.text.bodyMedium!.copyWith(fontWeight: FontWeight.w600, color: palette.onPrimary),
              ),
              // Step 1: the results count, in a small pill.
              Container(
                padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.sm, vertical: IgongoSpace.xxs),
                decoration: BoxDecoration(
                  color: palette.primary,
                  borderRadius: BorderRadius.circular(IgongoRadius.pill),
                ),
                child: Text(
                  '$resultCount Results',
                  style: context.text.labelSmall!.copyWith(
                    fontWeight: FontWeight.w700,
                    color: palette.primaryContainer,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
