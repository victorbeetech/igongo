// Grey placeholder rows shown while a list loads, with the brand spiral on top.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';
import '../loader/spiral_loader.dart';

/// Placeholder rows that stand where content will appear.
class SkeletonList extends StatelessWidget {
  /// Creates [rows] placeholder rows.
  const SkeletonList({super.key, this.rows = 6});

  /// How many rows to show.
  final int rows;

  @override
  Widget build(BuildContext context) {
    final fill = context.palette.surfaceAlt;
    // One grey bar of a given width.
    Widget bar(double widthFactor) => FractionallySizedBox(
      widthFactor: widthFactor,
      child: Container(
        height: 10,
        decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(4)),
      ),
    );
    return Column(
      children: [
        const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: SpiralLoader()),
        for (var i = 0; i < rows; i++)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg, vertical: IgongoSpace.sm),
            child: Row(
              spacing: IgongoSpace.md,
              children: [
                CircleAvatar(radius: 18, backgroundColor: fill),
                Expanded(
                  child: Column(
                    spacing: 6,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [bar(0.7), bar(0.4)],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
