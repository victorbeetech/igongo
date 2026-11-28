// Spa treatment booking and payment (design: "Payment & Confirmation"), live
// from the spa API. Treatments are the spa's offerings; each treatment's slots
// are its times. The therapist, pressure, focus areas and health notes are sent
// with the booking as its notes, so the spa team sees them. The deposit is the
// API's rule; the amounts are the API's prices.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_app_bar.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_section_card.dart';
import 'package:igongo/shared/bookings/application/bookings_providers.dart';
import 'package:igongo/shared/bookings/domain/booking_place.dart';
import 'package:igongo/shared/bookings/domain/booking_rules.dart';
import 'package:igongo/shared/bookings/domain/offering.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_choice_tile.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_date_strip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_dates.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_hero.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_offerings_scope.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_section_heading.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_select_chip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_submit.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/format/day_key.dart';
import 'package:igongo/shared/format/ugx.dart';
import 'package:igongo/shared/theme/theme.dart';

/// The therapist choices, in the order the screen shows them.
const _therapists = ['Female', 'Male', 'Any expert'];

/// The pressure choices, in the order the screen shows them.
const _pressures = ['Gentle', 'Medium', 'Firm'];

/// The focus areas the guest can pick.
const _focusAreas = ['Neck & shoulders', 'Lower back', 'Legs & feet', 'Scalp & temples'];

/// The spa treatment booking and payment screen, live from the spa API.
class SpaPaymentConfirmationScreen extends ConsumerStatefulWidget {
  /// Creates the spa screen for [place] (the spa module).
  const SpaPaymentConfirmationScreen({super.key, required this.place});

  /// The spa module.
  final BookingPlace place;

  @override
  ConsumerState<SpaPaymentConfirmationScreen> createState() => _SpaPaymentConfirmationScreenState();
}

class _SpaPaymentConfirmationScreenState extends ConsumerState<SpaPaymentConfirmationScreen> {
  /// The picked treatment (index into the spa's treatments), day and slot (index into the treatment's slots).
  int _treatment = 0;
  DateTime _day = flowNextDays(5).first;
  int _slot = 0;

  /// The therapist (index into [_therapists]) and the pressure (index into [_pressures]).
  int _therapist = 2;
  int _pressure = 1;

  /// The focus areas picked (indexes into [_focusAreas]).
  final Set<int> _focus = {};

  /// The allergy and skin note the guest typed.
  final _notes = TextEditingController();

  /// True while the booking is being made.
  bool _busy = false;

  @override
  void dispose() {
    _notes.dispose();
    super.dispose();
  }

  /// The notes sent with the booking: the choices in words, plus the guest's own note.
  String get _bookingNotes {
    final parts = [
      'Therapist: ${_therapists[_therapist]}',
      'Pressure: ${_pressures[_pressure]}',
      if (_focus.isNotEmpty) 'Focus: ${[for (final i in _focus) _focusAreas[i]].join(', ')}',
      if (_notes.text.trim().isNotEmpty) 'Health notes: ${_notes.text.trim()}',
    ];
    return parts.join('. ');
  }

  /// Books the treatment on the day and slot picked, with the notes, then moves on.
  Future<void> _confirm(Offering treatment) async {
    setState(() => _busy = true);
    await submitFlowBooking(
      context,
      ref,
      widget.place,
      lines: [(offering: treatment, units: 1)],
      date: dayKey(_day),
      slot: treatment.slots.isEmpty ? null : treatment.slots[_slot.clamp(0, treatment.slots.length - 1)],
      notes: _bookingNotes,
    );
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final all = ref.watch(offeringsProvider(widget.place)).valueOrNull ?? const <Offering>[];
    final treatments = [for (final o in all) if (o.kind == 'slot') o];
    final rules = ref.watch(bookingRulesProvider(widget.place)).valueOrNull;
    final treatment = treatments.isEmpty ? null : treatments[_treatment.clamp(0, treatments.length - 1)];
    return Scaffold(
      backgroundColor: context.palette.background,
      appBar: const CheckoutAppBar(title: 'Payment & Confirmation'),
      bottomNavigationBar: treatment == null
          ? null
          : FlowBottomBar(
              caption: 'Deposit due today',
              amount: ugx(rules?.depositOn(treatment.price) ?? 0),
              buttonLabel: 'Confirm Appointment',
              icon: Icons.event_available,
              onPressed: _busy ? null : () => _confirm(treatment),
            ),
      body: FlowOfferingsScope(
        place: widget.place,
        emptyText: 'No spa treatments are on sale yet.',
        builder: (context, _, _) => treatment == null
            ? const Center(child: Text('No spa treatments are on sale yet.'))
            : _body(treatments, treatment, rules),
      ),
    );
  }

  /// The screen body, once the treatments load.
  Widget _body(List<Offering> treatments, Offering treatment, BookingRules? rules) {
    final palette = context.palette;
    final slots = treatment.slots;
    final deposit = rules?.depositOn(treatment.price) ?? 0;
    return ListView(
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
        // Step 1: the spa's treatments, each priced by the API.
        const FlowSectionHeading(eyebrow: 'Curated therapies', title: 'Select Treatment'),
        const SizedBox(height: IgongoSpace.md),
        for (var i = 0; i < treatments.length; i++) ...[
          FlowChoiceTile(
            title: treatments[i].name,
            subtitle: treatments[i].description,
            tags: [if (treatments[i].slots.isNotEmpty) FlowTag('${treatments[i].slots.length} times')],
            amount: ugx(treatments[i].price),
            selected: _treatment == i,
            onTap: () => setState(() {
              _treatment = i;
              _slot = 0;
            }),
          ),
          const SizedBox(height: IgongoSpace.sm),
        ],
        const SizedBox(height: IgongoSpace.md),
        // Step 2: the preferred day and the treatment's slot.
        const FlowSectionHeading(eyebrow: 'Preferred day', title: 'Choose Day & Slot'),
        const SizedBox(height: IgongoSpace.md),
        FlowDateStrip(days: flowNextDays(5), selected: _day, onChanged: (d) => setState(() => _day = d)),
        const SizedBox(height: IgongoSpace.md),
        if (slots.isNotEmpty)
          Wrap(
            spacing: IgongoSpace.sm,
            runSpacing: IgongoSpace.sm,
            children: [
              for (var i = 0; i < slots.length; i++)
                FlowSelectChip(label: slots[i], selected: _slot == i, onTap: () => setState(() => _slot = i)),
            ],
          ),
        const SizedBox(height: IgongoSpace.lg),
        // Step 3: the therapist, the pressure and the focus, sent with the booking as notes.
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
              Expanded(child: FlowSelectChip(label: _pressures[i], selected: _pressure == i, onTap: () => setState(() => _pressure = i))),
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
                // Toggle this focus area on or off.
                onTap: () => setState(() => _focus.contains(i) ? _focus.remove(i) : _focus.add(i)),
              ),
          ],
        ),
        const SizedBox(height: IgongoSpace.md),
        // Allergies and skin notes, sent with the booking.
        TextField(
          controller: _notes,
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
        // Step 4: the deposit the API asks for now; the rest is paid at the spa reception.
        CheckoutSectionCard(
          padding: const EdgeInsets.all(IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: Text('Deposit', style: context.text.titleMedium?.copyWith(fontWeight: FontWeight.w700))),
                  const FlowTag('Protected booking', solid: true),
                ],
              ),
              const SizedBox(height: IgongoSpace.sm),
              Text(
                rules == null || rules.depositPercent == 0
                    ? 'Nothing is due now. The full amount is paid at the spa reception.'
                    : 'The deposit guarantees your therapist and time. The rest is paid at the spa reception after treatment.',
                style: context.text.bodySmall?.copyWith(color: palette.textMuted),
              ),
              const SizedBox(height: IgongoSpace.sm),
              FlowChoiceTile(title: 'Commitment deposit', amount: ugx(deposit), selected: true, onTap: null),
            ],
          ),
        ),
      ],
    );
  }
}
