// Spa treatment booking with payment (design: "Payment & Confirmation").
// Covers the treatment, the preferred day and slot, the sanctuary location,
// the therapist, the personal focus and health notes, and the deposit or
// room-folio choice. Amounts are placeholders until the API supplies them.
// Selections are local UI state only.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_date_strip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_select_chip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The spa treatment booking and payment screen.
class SpaPaymentConfirmationScreen extends StatefulWidget {
  /// Creates the spa screen.
  const SpaPaymentConfirmationScreen({super.key});

  @override
  State<SpaPaymentConfirmationScreen> createState() => _SpaPaymentConfirmationScreenState();
}

class _SpaPaymentConfirmationScreenState extends State<SpaPaymentConfirmationScreen> {
  /// The picked treatment (index into [_treatments]).
  int _treatment = 0;

  /// The picked day, and the picked slot (index into [_slots]).
  late DateTime _day = flowNextDays(5).first;
  int _slot = 2;

  /// The sanctuary location: 0 private pavilion, 1 in-cottage veranda service.
  int _location = 0;

  /// The therapist (0 female, 1 male, 2 any expert) and the pressure (0 gentle, 1 medium, 2 firm).
  int _therapist = 2;
  int _pressure = 1;

  /// The focus areas picked (indexes into [_focusAreas]).
  final Set<int> _focus = {0, 1};

  /// The billing choice: 0 pay the commitment deposit, 1 bill to the room folio.
  int _billing = 0;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    final days = flowNextDays(5);
    return Scaffold(
      backgroundColor: palette.background,
      appBar: CheckoutAppBar(
        title: 'Payment & Confirmation',
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.call, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Hero: the spa suite, the sanctuary and a short line.
          const FlowHero(
            photo: 'assets/photos/room-bathroom.jpg',
            kicker: 'Regal Restorative Sanctuary',
            title: 'Ankole Herbal Wellness & Spa Sanctuary',
            detail: 'Ancestral royal botanicals, clarified organic ghee rubs and unhurried tranquillity in Mbarara.',
            height: 220,
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 1: the curated therapies, each with duration and a focus tag.
          const FlowSectionHeading(eyebrow: 'Curated therapies', title: 'Select Treatment', meta: 'Select treatment'),
          const SizedBox(height: IgongoSpace.md),
          for (var i = 0; i < _treatments.length; i++) ...[
            FlowChoiceTile(
              title: _treatments[i].$1,
              subtitle: '${_treatments[i].$2} • ${_treatments[i].$3}',
              tags: [FlowTag(_treatments[i].$4)],
              amount: kAmountPlaceholder,
              selected: _treatment == i,
              onTap: () => setState(() => _treatment = i),
            ),
            const SizedBox(height: IgongoSpace.sm),
          ],
          const SizedBox(height: IgongoSpace.md),
          // Step 2: the preferred day and the available slot.
          const FlowSectionHeading(eyebrow: 'Preferred day', title: 'Choose Day & Slot'),
          const SizedBox(height: IgongoSpace.md),
          FlowDateStrip(days: days, selected: _day, onChanged: (d) => setState(() => _day = d)),
          const SizedBox(height: IgongoSpace.md),
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < _slots.length; i++)
                FlowSelectChip(
                  label: _slots[i],
                  selected: _slot == i,
                  onTap: () => setState(() => _slot = i),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 3: where the treatment happens.
          const FlowSectionHeading(eyebrow: 'Sanctuary location', title: 'Where Would You Like To Relax?'),
          const SizedBox(height: IgongoSpace.md),
          FlowChoiceTile(
            title: 'Private spa pavilion suite',
            subtitle: 'Forest view, scented herbal steamer and rain shower',
            amount: 'Standard',
            selected: _location == 0,
            onTap: () => setState(() => _location = 0),
          ),
          const SizedBox(height: IgongoSpace.sm),
          FlowChoiceTile(
            title: 'In-cottage veranda service',
            subtitle: 'Portable heated massage plinth delivered to your room',
            amount: '+$kAmountPlaceholder',
            selected: _location == 1,
            onTap: () => setState(() => _location = 1),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 4: the therapist, then the focus and health choices.
          const FlowSectionHeading(eyebrow: 'Therapist', title: 'Therapist Preference'),
          const SizedBox(height: IgongoSpace.md),
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < _therapists.length; i++)
                FlowSelectChip(
                  label: _therapists[i],
                  icon: Icons.person_outline,
                  selected: _therapist == i,
                  onTap: () => setState(() => _therapist = i),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          const FlowSectionHeading(eyebrow: 'Personalised focus & health', title: 'Pressure Preference'),
          const SizedBox(height: IgongoSpace.md),
          Row(
            children: [
              for (var i = 0; i < _pressures.length; i++) ...[
                Expanded(
                  child: FlowSelectChip(
                    label: _pressures[i],
                    selected: _pressure == i,
                    onTap: () => setState(() => _pressure = i),
                  ),
                ),
                if (i < _pressures.length - 1) const SizedBox(width: IgongoSpace.xs),
              ],
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          Text('Focus areas', style: context.text.labelLarge?.copyWith(color: palette.textMuted)),
          const SizedBox(height: IgongoSpace.xs),
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < _focusAreas.length; i++)
                FlowSelectChip(
                  label: _focusAreas[i],
                  selected: _focus.contains(i),
                  onTap: () => setState(() {
                    // Step 1: toggle this focus area on or off.
                    if (_focus.contains(i)) {
                      _focus.remove(i);
                    } else {
                      _focus.add(i);
                    }
                  }),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.md),
          // Allergies and skin notes, as a text box.
          TextField(
            minLines: 2,
            maxLines: 4,
            decoration: InputDecoration(
              labelText: 'Allergies, skin sensitivities or pregnancy notes',
              hintText: 'For example almond oil sensitivity or preferred calming scent',
              filled: true,
              fillColor: palette.surface,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(IgongoRadius.md)),
            ),
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Step 5: the deposit or the room-folio billing.
          CheckoutSectionCard(
            padding: const EdgeInsets.all(IgongoSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text('Deposit & Billing', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                    const FlowTag('Protected booking', solid: true),
                  ],
                ),
                const SizedBox(height: IgongoSpace.sm),
                FlowChoiceTile(
                  title: 'Pay commitment deposit',
                  subtitle: 'Guarantees your therapist and suite time. The rest is paid at the spa reception after treatment.',
                  amount: kAmountPlaceholder,
                  selected: _billing == 0,
                  onTap: () => setState(() => _billing = 0),
                ),
                const SizedBox(height: IgongoSpace.sm),
                FlowChoiceTile(
                  title: 'Bill to guest room folio',
                  subtitle: 'Zero upfront charge now. Added directly to your suite departure invoice.',
                  amount: kAmountPlaceholder,
                  selected: _billing == 1,
                  onTap: () => setState(() => _billing = 1),
                ),
              ],
            ),
          ),
          const SizedBox(height: IgongoSpace.md),
          // Spa reception and WhatsApp butler actions.
          Row(
            children: [
              Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.call), label: const Text('Spa reception'))),
              const SizedBox(width: IgongoSpace.sm),
              Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.chat), label: const Text('WhatsApp butler'))),
            ],
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Total',
        amount: kAmountPlaceholder,
        buttonLabel: 'Confirm Appointment',
        icon: Icons.event_available,
      ),
    );
  }

  /// The treatments: name, duration, detail and focus tag.
  static const List<(String, String, String, String)> _treatments = [
    ('Signature Ankole organic ghee & herbal body scrub', '60 mins', 'Purifying wild sage, raw beeswax and royal churned Ankole cow butter.', 'Sacred botanical'),
    ('Deep tissue safari recovery massage', '75 mins', 'Targeted muscle release with warm eucalyptus and wild ginger after game trails.', 'High pressure'),
    ('Traditional aromatherapy relaxation session', '60 mins', 'Gentle strokes with cold-pressed marula, frankincense and chamomile.', 'Serenity focus'),
    ('Couples sunset wellness journey', '90 mins', 'Dual synchronised massage overlooking the valley, with sparkling wine.', 'Sparkling wine included'),
  ];

  /// The bookable slots.
  static const List<String> _slots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', 'Sunset special'];

  /// The therapist choices.
  static const List<String> _therapists = ['Female', 'Male', 'Any expert'];

  /// The pressure choices.
  static const List<String> _pressures = ['Gentle', 'Medium', 'Firm'];

  /// The focus areas.
  static const List<String> _focusAreas = ['Neck & shoulders', 'Lower back', 'Legs & feet', 'Scalp & temples'];
}
