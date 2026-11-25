// The settings layout: switches for the module's options and a Save button.
// Everything here is something the super admin sets without code.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../catalog/catalog.dart';
import '../../theme/theme.dart';
import '../../ui/button/igongo_button.dart';
import '../../ui/section/section_header.dart';
import '../../ui/toast/igongo_toast.dart';
import '../parts/dialog_buttons.dart';
import '../parts/link_rows.dart';
import '../parts/purpose_text.dart';
import '../parts/screen_list_view.dart';

/// Switches and choices with a Save button.
class SettingsLayout extends StatelessWidget {
  /// Creates the settings screen for [screen].
  const SettingsLayout(this.screen, {super.key});

  /// The screen being drawn.
  final ScreenContext screen;

  @override
  Widget build(BuildContext context) {
    final mock = screen.module.mock;
    return ScreenListView(
      children: [
        PurposeText(screen.spec.purpose),
        const SectionHeader('Options'),
        // Step 1: one switch per option, from the module's sample items.
        for (final (i, item) in mock.items.take(5).indexed)
          _OptionSwitch(
            label: item,
            hint: i.isEven ? 'On for every role that uses it' : 'Off until the super admin turns it on',
            initial: i.isEven,
          ),
        LinkRows(screen, title: 'More settings'),
        DialogButtons(screen),
        // Step 2: Save, which confirms with a toast.
        Padding(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: IgongoButton(
            label: 'Save changes',
            expand: true,
            onPressed: () => showIgongoToast(context, 'Changes saved', action: 'Undo'),
          ),
        ),
      ],
    );
  }
}

// One labelled switch that remembers its own position while the screen is open.
class _OptionSwitch extends StatefulWidget {
  const _OptionSwitch({required this.label, required this.hint, required this.initial});

  final String label;
  final String hint;
  final bool initial;

  @override
  State<_OptionSwitch> createState() => _OptionSwitchState();
}

class _OptionSwitchState extends State<_OptionSwitch> {
  late bool _on = widget.initial;

  @override
  Widget build(BuildContext context) => SwitchListTile(
    value: _on,
    onChanged: (v) => setState(() => _on = v),
    title: Text(widget.label, style: context.text.titleSmall),
    subtitle: Text(widget.hint),
  );
}
