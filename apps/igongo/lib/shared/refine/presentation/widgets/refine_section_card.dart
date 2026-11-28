// The white card that groups one section of the filter: a title row, an optional
// note, then the section's content.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../theme/theme.dart';

/// One section card of the filter.
class RefineSectionCard extends StatelessWidget {
  /// Creates a section. [trailing] is the small word on the right of the title; [note] is a line under it.
  const RefineSectionCard({
    super.key,
    required this.title,
    required this.child,
    this.trailing,
    this.note,
    this.gap = IgongoSpace.sm,
  });

  /// The section title, such as `Categories`.
  final String title;

  /// The small word on the right of the title row, if any.
  final Widget? trailing;

  /// A line of explanation under the title row, if any.
  final String? note;

  /// The content of the section.
  final Widget child;

  /// The space between the title block and the content.
  final double gap;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.md),
        // A soft one-pixel shadow, so the card lifts a little off the page.
        boxShadow: [BoxShadow(color: palette.text.withValues(alpha: 0.06), blurRadius: 2, offset: const Offset(0, 1))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: gap,
        children: [
          // Step 1: the title, with the trailing word on the right.
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: context.text.titleSmall!.copyWith(fontWeight: FontWeight.w600)),
              if (trailing != null) Flexible(child: trailing!),
            ],
          ),
          // Step 2: the explanation line, if the section has one.
          if (note != null) Text(note!, style: context.text.bodySmall!.copyWith(color: palette.textMuted)),
          // Step 3: the section's own content.
          child,
        ],
      ),
    );
  }
}
