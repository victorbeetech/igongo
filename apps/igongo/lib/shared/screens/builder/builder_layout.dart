// The builder layout: the parts to drag, a canvas and Preview. Used by the
// super admin's role, layout, form, card and workflow builders.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/section/section_header.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';

/// A drag and drop builder: parts, canvas and actions.
class BuilderLayout extends StatelessWidget {
  /// Creates the builder for [screen].
  const BuilderLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    final mock = screen.module.mock;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        // Step 1: the parts that can be dragged onto the canvas.
        const SectionHeader('Parts'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (final f in mock.fields) Chip(avatar: const Icon(Icons.drag_indicator, size: 16), label: Text(f)),
            ],
          ),
        ),
        // Step 2: the canvas, with the parts already placed.
        const SectionHeader('Canvas'),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          padding: const EdgeInsets.all(IgongoSpace.md),
          decoration: BoxDecoration(
            color: p.surfaceAlt,
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            border: Border.all(color: p.border),
          ),
          child: Column(
            spacing: IgongoSpace.sm,
            children: [
              for (final f in mock.fields.take(3))
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(IgongoSpace.md),
                  decoration: BoxDecoration(
                    color: p.surface,
                    borderRadius: BorderRadius.circular(IgongoRadius.sm),
                    border: Border.all(color: p.border),
                  ),
                  child: Text(f, style: context.text.labelLarge),
                ),
              Text('Drag a part here', style: context.text.bodySmall),
            ],
          ),
        ),
        LinkRows(screen),
        DialogButtons(screen),
        // Step 3: preview before publishing, as every builder change is a change set.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: IgongoButton(
            label: 'Preview',
            icon: Icons.visibility_outlined,
            expand: true,
            onPressed: screen.links.isEmpty ? null : () => screen.open(screen.links.first),
          ),
        ),
      ],
    );
  }
}
