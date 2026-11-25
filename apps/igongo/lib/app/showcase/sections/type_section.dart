// Showcase: the seven text styles, with their token name and size.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../showcase_section.dart';

/// Each text style, written in itself, at the current text size.
class TypeSection extends StatelessWidget {
  /// Creates the section.
  const TypeSection({super.key});

  @override
  Widget build(BuildContext context) {
    final t = context.text;
    // The Igongo style names, the Material slot each one fills and its size.
    final styles = [
      ('Display · Cinzel ${IgongoType.display.size.toInt()}', t.displaySmall),
      ('Headline · ${IgongoType.headline.size.toInt()}', t.headlineSmall),
      ('Title · ${IgongoType.title.size.toInt()}', t.titleMedium),
      ('Subtitle · ${IgongoType.subtitle.size.toInt()}', t.titleSmall),
      ('Body · ${IgongoType.body.size.toInt()}', t.bodyMedium),
      ('Label · ${IgongoType.label.size.toInt()}', t.labelLarge),
      ('Caption · ${IgongoType.caption.size.toInt()}', t.bodySmall),
    ];
    return ShowcaseSection(
      title: 'Type',
      children: [for (final (name, style) in styles) Text(name, style: style)],
    );
  }
}
