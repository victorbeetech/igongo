// Step 2 of checkout: the guest's name and phone, the cottage or table, the
// delivery instructions, the cutlery choice and the staff tip. Inputs are
// local until checkout is wired to the API; amounts are placeholders.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/theme/theme.dart';
import '../../../../shared/ui/button/igongo_button.dart';
import 'checkout_app_bar.dart';
import 'checkout_placeholders.dart';
import 'checkout_section_card.dart';
import 'checkout_step_bar.dart';
import 'payment_selection_screen.dart';

/// The guest details screen (step 2 of 3).
class GuestDetailsScreen extends StatefulWidget {
  /// Creates the screen.
  const GuestDetailsScreen({super.key});

  @override
  State<GuestDetailsScreen> createState() => _GuestDetailsScreenState();
}

class _GuestDetailsScreenState extends State<GuestDetailsScreen> {
  /// The recipient's name (filled from the account later).
  final _name = TextEditingController(text: '');

  /// The Uganda phone number for SMS and WhatsApp updates.
  final _phone = TextEditingController(text: '');

  /// Where the food should be left.
  final _instructions = TextEditingController(text: '');

  /// Whether to include biodegradable cutlery.
  bool _cutlery = true;

  @override
  void dispose() {
    // Step 1: release the text controllers when the screen closes.
    _name.dispose();
    _phone.dispose();
    _instructions.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: const CheckoutAppBar(title: 'Guest Details'),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.sm, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Step 1: progress, currently on step 2.
          const CheckoutStepBar(step: 2, stepName: 'Guest details & delivery'),
          const SizedBox(height: IgongoSpace.lg),
          // Step 2: the recipient block (name and phone).
          CheckoutSectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Recipient information', style: context.text.titleMedium),
                const SizedBox(height: IgongoSpace.md),
                _LabelledField(label: 'Full name', controller: _name, icon: Icons.badge_outlined),
                const SizedBox(height: IgongoSpace.md),
                _LabelledField(
                  label: 'Uganda phone (SMS & updates)',
                  controller: _phone,
                  icon: Icons.phone_outlined,
                  keyboard: TextInputType.phone,
                  prefix: '+256',
                ),
                const SizedBox(height: IgongoSpace.xs),
                Text(
                  'Order notifications are sent by SMS and WhatsApp',
                  style: context.text.bodySmall?.copyWith(color: palette.textMuted),
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 3: the location block (cottage or table, and the delivery instructions).
          CheckoutSectionCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Resort location', style: context.text.titleMedium),
                const SizedBox(height: IgongoSpace.md),
                // Step 3a: the cottage picker (placeholder list until the API supplies places).
                InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Cottage / suite / table',
                    prefixIcon: Icon(Icons.meeting_room_outlined),
                  ),
                  child: Text('Choose your place', style: context.text.bodyLarge),
                ),
                const SizedBox(height: IgongoSpace.md),
                _LabelledField(label: 'Spot delivery instructions', controller: _instructions, maxLines: 3),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 4: the cutlery toggle.
          CheckoutSectionCard(
            child: SwitchListTile(
              contentPadding: EdgeInsets.zero,
              secondary: Icon(Icons.restaurant_outlined, color: palette.primary),
              title: Text('Biodegradable cutlery', style: context.text.titleSmall),
              subtitle: Text('Includes napkins & wooden utensils', style: context.text.bodySmall),
              value: _cutlery,
              activeThumbColor: palette.onPrimary,
              activeTrackColor: palette.primary,
              onChanged: (v) => setState(() => _cutlery = v),
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Step 5: the staff tip (the choices are placeholders until tips are wired).
          const _TipCard(),
          const SizedBox(height: IgongoSpace.lg),
          // Step 6: the total with placeholder amounts.
          const _TotalCard(),
        ],
      ),
      bottomNavigationBar: SafeArea(
        minimum: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
        child: IgongoButton(
          label: 'Proceed to Payment',
          icon: Icons.arrow_forward,
          expand: true,
          // Step 7: go to step 3 (payment).
          onPressed: () =>
              Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const PaymentSelectionScreen())),
        ),
      ),
    );
  }
}

/// A text field with a label above it and an optional icon or prefix.
class _LabelledField extends StatelessWidget {
  /// Creates the field.
  const _LabelledField({
    required this.label,
    required this.controller,
    this.icon,
    this.prefix,
    this.keyboard,
    this.maxLines = 1,
  });

  /// The label shown above the field, in capitals.
  final String label;

  /// The text the field holds.
  final TextEditingController controller;

  /// The leading icon (optional).
  final IconData? icon;

  /// A fixed prefix such as the country code (optional).
  final String? prefix;

  /// The keyboard type (optional).
  final TextInputType? keyboard;

  /// How many lines the field shows.
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: context.text.labelSmall),
        const SizedBox(height: IgongoSpace.xs),
        TextField(
          controller: controller,
          keyboardType: keyboard,
          maxLines: maxLines,
          decoration: InputDecoration(
            prefixIcon: icon == null ? null : Icon(icon),
            prefixText: prefix == null ? null : '$prefix  ',
            isDense: false,
          ),
        ),
      ],
    );
  }
}

/// The staff appreciation tip: the four choices (no tip, a fixed amount, custom).
class _TipCard extends StatefulWidget {
  /// Creates the tip card.
  const _TipCard();

  @override
  State<_TipCard> createState() => _TipCardState();
}

class _TipCardState extends State<_TipCard> {
  /// The tip choice the guest picked (index into the choices below).
  int _choice = 0;

  /// The four choices: no tip, two fixed amounts and a custom amount.
  static const _labels = ['No tip', 'Small', 'Medium', 'Custom'];

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Staff appreciation tip', style: context.text.titleMedium)),
              Text('100% to servers', style: context.text.labelSmall?.copyWith(color: palette.accent)),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Text('Thank the crew for their care.', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.md),
          Row(
            children: [
              for (var i = 0; i < _labels.length; i++)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 3),
                    child: ChoiceChip(
                      label: SizedBox(
                        width: double.infinity,
                        child: Text(_labels[i], textAlign: TextAlign.center),
                      ),
                      selected: _choice == i,
                      showCheckmark: false,
                      selectedColor: palette.primary,
                      labelStyle: context.text.labelMedium?.copyWith(
                        color: _choice == i ? palette.onPrimary : palette.text,
                      ),
                      onSelected: (_) => setState(() => _choice = i),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
}

/// The total card: subtotal, the tip, delivery and the grand total (placeholders).
class _TotalCard extends StatelessWidget {
  /// Creates the total card.
  const _TotalCard();

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return CheckoutSectionCard(
      child: Column(
        children: [
          Row(
            children: [
              Expanded(child: Text('Subtotal (items)', style: context.text.bodyMedium)),
              Text(kAmountPlaceholder, style: context.text.bodyMedium),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              Expanded(child: Text('Appreciation tip', style: context.text.bodyMedium)),
              Text(kAmountPlaceholder, style: context.text.bodyMedium?.copyWith(color: palette.accent)),
            ],
          ),
          const SizedBox(height: IgongoSpace.xs),
          Row(
            children: [
              Expanded(child: Text('Room delivery & tax', style: context.text.bodyMedium)),
              Text('Complimentary', style: context.text.bodyMedium?.copyWith(color: palette.success)),
            ],
          ),
          const Divider(height: IgongoSpace.lg),
          Row(
            children: [
              Expanded(child: Text('Grand total', style: context.text.titleMedium)),
              Text(kAmountPlaceholder, style: context.text.titleLarge?.copyWith(color: palette.primary)),
            ],
          ),
        ],
      ),
    );
  }
}
