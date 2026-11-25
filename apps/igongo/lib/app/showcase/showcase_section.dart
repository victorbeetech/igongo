// One titled block of the design system showcase, such as "Buttons".

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../shared/ui/section/section_header.dart';

/// A section header and its examples, laid out with even gaps.
class ShowcaseSection extends StatelessWidget {
  /// Creates a section called [title] showing [children].
  const ShowcaseSection({super.key, required this.title, required this.children});

  /// The section name.
  final String title;

  /// The examples, top to bottom.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SectionHeader(title),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, spacing: IgongoSpace.sm, children: children),
        ),
      ],
    );
  }
}
