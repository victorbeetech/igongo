// The line of active filters under the search box. It shows when the filter
// button is tapped. Each filter is a small pill with a close icon.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';

/// The active filters, as pills in a wrapping row.
class DiscoveryFilterSummary extends StatelessWidget {
  /// Creates the line for [filters], such as "Price: Any".
  const DiscoveryFilterSummary({super.key, required this.filters});

  /// The filter words, one pill each.
  final List<String> filters;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return Wrap(
      spacing: IgongoSpace.sm,
      runSpacing: IgongoSpace.xs,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        Text('Active filters:', style: context.text.labelSmall?.copyWith(color: p.textMuted)),
        for (final filter in filters)
          // Step 1: each filter is a warm pill with its words and a close icon.
          DecoratedBox(
            decoration: BoxDecoration(
              color: p.warmCard,
              borderRadius: BorderRadius.circular(IgongoRadius.pill),
              border: Border.all(color: p.border),
            ),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.sm, IgongoSpace.xs, IgongoSpace.xs, IgongoSpace.xs),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(filter, style: context.text.labelSmall?.copyWith(color: p.text, fontWeight: FontWeight.w600)),
                  const SizedBox(width: IgongoSpace.xxs),
                  Icon(Icons.close, size: IgongoSpace.md, color: p.text),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
