// A small bar chart for dashboards, drawn with the brand red. Real charts
// (fl_chart) replace it when data arrives in Phase 7.

import 'package:material_ui/material_ui.dart';

import '../../theme/theme.dart';

/// Bars for a week of sample values between 0 and 1.
class BarChart extends StatelessWidget {
  /// Creates a chart of [values], one bar per [labels] entry.
  const BarChart({super.key, required this.values, required this.labels, this.height = 120});

  /// Bar heights from 0 to 1.
  final List<double> values;

  /// The label under each bar.
  final List<String> labels;

  /// The chart height.
  final double height;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Semantics(
      label: 'Bar chart',
      child: SizedBox(
        height: height,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          spacing: 8,
          children: [
            for (var i = 0; i < values.length; i++)
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  spacing: 4,
                  children: [
                    // The last bar (today) is full red; earlier bars are softer.
                    Flexible(
                      child: FractionallySizedBox(
                        heightFactor: values[i],
                        child: Container(
                          decoration: BoxDecoration(
                            color: i == values.length - 1 ? p.primaryText : p.primaryText.withValues(alpha: 0.35),
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                          ),
                        ),
                      ),
                    ),
                    Text(labels[i], style: context.text.labelSmall?.copyWith(color: p.textMuted)),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
