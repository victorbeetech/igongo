// The design system showcase: every token and every shared component on one
// screen, in the current theme and text size, for review. Open it from the
// preview panel, or at /design-system. It reads only the theme and the shared
// components, so it always shows exactly what the screens use.

import 'package:material_ui/material_ui.dart';

import '../../shared/layout/igongo_scaffold.dart';
import '../preview/preview_sheet.dart';
import 'sections/brand_section.dart';
import 'sections/button_section.dart';
import 'sections/card_section.dart';
import 'sections/chip_section.dart';
import 'sections/colour_section.dart';
import 'sections/feedback_section.dart';
import 'sections/field_section.dart';
import 'sections/illustration_section.dart';
import 'sections/type_section.dart';

/// The design system showcase screen.
class DesignSystemScreen extends StatelessWidget {
  /// Creates the showcase.
  const DesignSystemScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return IgongoScaffold(
      title: 'Design system',
      // The preview panel switches theme and text size, to check both here.
      actions: [
        IconButton(tooltip: 'Preview', icon: const Icon(Icons.tune), onPressed: () => showPreviewSheet(context)),
      ],
      body: ListView(
        padding: const EdgeInsets.only(bottom: 48),
        children: const [
          BrandSection(),
          ColourSection(),
          TypeSection(),
          ButtonSection(),
          FieldSection(),
          ChipSection(),
          CardSection(),
          FeedbackSection(),
          IllustrationSection(),
        ],
      ),
    );
  }
}
