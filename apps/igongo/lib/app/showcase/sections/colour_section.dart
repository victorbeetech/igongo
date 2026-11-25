// Showcase: every colour token of the current mode, with its name and value.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/theme/theme.dart';
import '../showcase_section.dart';

/// A swatch for every palette token. Switch the theme to see the other mode.
class ColourSection extends StatelessWidget {
  /// Creates the section.
  const ColourSection({super.key});

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return ShowcaseSection(
      title: context.isDark ? 'Colours (dark mode)' : 'Colours (light mode)',
      children: [
        Wrap(
          spacing: IgongoSpace.sm,
          runSpacing: IgongoSpace.sm,
          children: [for (final MapEntry(:key, :value) in p.named.entries) _Swatch(name: key, colour: value)],
        ),
      ],
    );
  }
}

/// One colour: a filled box over its token name and hex value.
class _Swatch extends StatelessWidget {
  const _Swatch({required this.name, required this.colour});

  final String name;
  final Color colour;

  @override
  Widget build(BuildContext context) {
    // The hex value, such as #B8292F, from the colour's 32-bit value.
    final hex = '#${(colour.toARGB32() & 0xFFFFFF).toRadixString(16).padLeft(6, '0').toUpperCase()}';
    return SizedBox(
      width: 100,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.xxs,
        children: [
          Container(
            height: 40,
            decoration: BoxDecoration(
              color: colour,
              borderRadius: BorderRadius.circular(IgongoRadius.sm),
              border: Border.all(color: context.palette.border),
            ),
          ),
          Text(name, style: context.text.labelMedium, overflow: TextOverflow.ellipsis),
          Text(hex, style: context.text.bodySmall),
        ],
      ),
    );
  }
}
