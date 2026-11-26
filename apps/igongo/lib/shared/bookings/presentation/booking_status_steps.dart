// The four-step tracker on the booking status screen: Request, Confirmed,
// Ready and Completed, joined by lines. Done steps are filled in the brand red
// with a tick; the rest are outlined.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../domain/booking_timeline.dart';

/// The tracker for [completed] steps (0 to 4).
class BookingStatusSteps extends StatelessWidget {
  /// Creates the tracker.
  const BookingStatusSteps({super.key, required this.completed});

  /// How many of the four steps are done.
  final int completed;

  /// Height of the line that joins two steps.
  static const _line = IgongoSpace.xxs;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final children = <Widget>[];
    // Step 1: one dot and label per step, with a line between each pair.
    for (var i = 0; i < bookingStepWords.length; i++) {
      final done = i < completed;
      if (i > 0) {
        // The line joins the dots at their centres (the dot's radius is one large space).
        children.add(
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(top: IgongoSpace.lg - _line / 2),
              child: Container(height: _line, color: i <= completed ? p.primary : p.border),
            ),
          ),
        );
      }
      children.add(
        Column(
          children: [
            CircleAvatar(
              radius: IgongoSpace.lg,
              backgroundColor: done ? p.primary : p.surfaceAlt,
              child: done
                  ? Icon(Icons.check, color: p.onPrimary)
                  : Text('${i + 1}', style: context.text.labelLarge?.copyWith(color: p.textMuted)),
            ),
            const SizedBox(height: IgongoSpace.xs),
            Text(bookingStepWords[i], style: context.text.labelMedium?.copyWith(color: done ? p.text : p.textMuted)),
          ],
        ),
      );
    }
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: children);
  }
}
