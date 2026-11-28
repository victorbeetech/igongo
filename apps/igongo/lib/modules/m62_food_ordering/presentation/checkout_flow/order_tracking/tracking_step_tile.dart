// One stage of the order track: a round marker joined by a line to the next
// stage, the stage name, a short detail and a time. Done stages are ticked,
// the active stage is red, and upcoming stages are muted.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// How far the order has got at this stage.
enum TrackStageState {
  /// The stage is finished.
  done,

  /// The stage is happening now.
  active,

  /// The stage has not started.
  upcoming,
}

/// One row of the order track.
class TrackingStepTile extends StatelessWidget {
  /// Creates the row. [isLast] leaves out the line below the final stage.
  const TrackingStepTile({
    super.key,
    required this.title,
    required this.detail,
    required this.state,
    required this.isLast,
    this.time = '—',
  });

  /// The stage name.
  final String title;

  /// A short line describing the stage.
  final String detail;

  /// Whether the stage is done, active or still to come.
  final TrackStageState state;

  /// True for the final stage, which has no line below it.
  final bool isLast;

  /// The time the stage happened or is due (a placeholder until the API supplies it).
  final String time;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: pick the colours for this stage's state.
    final markColor = switch (state) {
      TrackStageState.done => palette.success,
      TrackStageState.active => palette.primary,
      TrackStageState.upcoming => palette.border,
    };
    final textColor = state == TrackStageState.upcoming ? palette.textMuted : palette.text;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Step 2: the marker and the line down to the next stage.
          SizedBox(
            width: 32,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 12,
                  backgroundColor: markColor,
                  child: Icon(
                    state == TrackStageState.done ? Icons.check : Icons.circle,
                    size: state == TrackStageState.done ? 14 : 8,
                    color: palette.onPrimary,
                  ),
                ),
                if (!isLast) Expanded(child: Container(width: 2, color: palette.border)),
              ],
            ),
          ),
          const SizedBox(width: IgongoSpace.sm),
          // Step 3: the stage name, detail and time.
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: IgongoSpace.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: context.text.titleSmall?.copyWith(
                            color: state == TrackStageState.active ? palette.primary : textColor,
                          ),
                        ),
                      ),
                      Text(time, style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
                    ],
                  ),
                  const SizedBox(height: IgongoSpace.xxs),
                  Text(detail, style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
