// Showcase: text fields, the search field, switches and choice chips.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/search/search_field.dart';
import '../showcase_section.dart';

/// Every kind of input, with sample hints.
class FieldSection extends StatelessWidget {
  /// Creates the section.
  const FieldSection({super.key});

  @override
  Widget build(BuildContext context) {
    return ShowcaseSection(
      title: 'Fields and controls',
      children: [
        const IgongoField(label: 'Full name', hint: 'Tumusiime Ronald', icon: Icons.person_outline),
        const IgongoField(label: 'Password', hint: 'At least 10 characters', obscure: true),
        const IgongoField(label: 'Notes', hint: 'Anything the next shift should know', lines: 3),
        const SearchField(hint: 'Search staff'),
        SwitchListTile(value: true, onChanged: (_) {}, title: const Text('Comments on')),
        SwitchListTile(value: false, onChanged: (_) {}, title: const Text('Likes only')),
        Wrap(
          spacing: IgongoSpace.sm,
          children: [
            ChoiceChip(label: const Text('All'), selected: true, onSelected: (_) {}),
            ChoiceChip(label: const Text('On duty'), selected: false, onSelected: (_) {}),
            ChoiceChip(label: const Text('On leave'), selected: false, onSelected: (_) {}),
          ],
        ),
      ],
    );
  }
}
