// Showcase: the four button variants, with an icon and disabled.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/ui/button/igongo_button.dart';
import '../showcase_section.dart';

/// Every button variant, enabled and disabled.
class ButtonSection extends StatelessWidget {
  /// Creates the section.
  const ButtonSection({super.key});

  @override
  Widget build(BuildContext context) {
    void tap() {} // The showcase buttons do nothing; they only show their look.
    return ShowcaseSection(
      title: 'Buttons',
      children: [
        Wrap(
          spacing: IgongoSpace.sm,
          runSpacing: IgongoSpace.sm,
          children: [
            IgongoButton(label: 'Save', onPressed: tap),
            IgongoButton(label: 'Add staff', icon: Icons.add, onPressed: tap),
            IgongoButton(label: 'Export', variant: ButtonVariant.secondary, onPressed: tap),
            IgongoButton(label: 'Block card', variant: ButtonVariant.danger, onPressed: tap),
            IgongoButton(label: 'Cancel', variant: ButtonVariant.text, onPressed: tap),
            const IgongoButton(label: 'Disabled'),
          ],
        ),
        IgongoButton(label: 'Full width', expand: true, onPressed: tap),
      ],
    );
  }
}
