// Primary guest details (design: "Guest Details", primary guest version).
// Shows the progress of the four booking steps, the reserved room, the
// primary guest fields, the curated preferences, the arrival time and the
// special arrangements card. Nothing is prefilled: fields show hints until
// the signed-in guest's profile is wired. The commitment amount is a
// placeholder until the API supplies it.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';
import 'package:igongo/modules/m62_food_ordering/presentation/checkout_flow/checkout_placeholders.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_bottom_bar.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_select_chip.dart';
import 'package:igongo/shared/bookings/presentation/flow/common/flow_tag.dart';
import 'package:igongo/shared/theme/theme.dart';
import 'package:igongo/shared/ui/photo/guest_photo.dart';

/// The primary guest details screen (step 2 of the booking).
class CottageGuestDetailsScreen extends StatefulWidget {
  /// Creates the guest details screen.
  const CottageGuestDetailsScreen({super.key});

  @override
  State<CottageGuestDetailsScreen> createState() => _CottageGuestDetailsScreenState();
}

class _CottageGuestDetailsScreenState extends State<CottageGuestDetailsScreen> {
  /// The picked celebration (index into [_occasions]); 0 is None.
  int _occasion = 0;

  /// The picked host language (index into [_languages]).
  int _language = 0;

  /// The picked check-in arrival window (index into [_arrivals]).
  int _arrival = 1;

  /// The four booking steps shown in the progress bar.
  static const List<String> _steps = ['Selection', 'Guest details', 'Deposit', 'Pass ready'];

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Scaffold(
      backgroundColor: palette.background,
      appBar: AppBar(
        backgroundColor: palette.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: IconButton(
          tooltip: 'Back',
          icon: Icon(Icons.arrow_back, color: palette.primary),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
        title: Text('Guest Details', style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand)),
        actions: [IconButton(tooltip: 'Call', icon: Icon(Icons.support_agent, color: palette.primary), onPressed: () {})],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.xs, IgongoSpace.lg, IgongoSpace.xxl),
        children: [
          // Progress: step 2 of 4, with the four stages.
          const _ProgressBar(steps: _steps, current: 1),
          const SizedBox(height: IgongoSpace.md),
          // The reserved room, with the dates and the number of guests.
          _ReservedRoomCard(),
          const SizedBox(height: IgongoSpace.lg),
          // Section 1: the primary guest's details.
          const _SectionTitle(number: '1', title: 'Primary Guest', badge: 'Verified profile'),
          const SizedBox(height: IgongoSpace.sm),
          const _FieldCard(
            children: [
              _LabelledField(label: 'Full legal name', hint: 'As on your national ID or passport', icon: Icons.person_outline),
              _LabelledField(
                label: 'Uganda WhatsApp number',
                hint: 'Digital room key and receipts are sent here',
                icon: Icons.chat_outlined,
                prefix: '🇺🇬 +256',
              ),
              _LabelledField(label: 'Email address', hint: 'name@example.com', icon: Icons.mail_outline),
              _LabelledField(label: 'Country of residence', hint: 'Select a country', icon: Icons.public, trailing: Icons.expand_more),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Section 2: curated preferences.
          const _SectionTitle(number: '2', title: 'Curated Preferences'),
          const SizedBox(height: IgongoSpace.sm),
          _FieldCard(
            children: [
              Text('Special celebration or occasion', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: IgongoSpace.xs),
              Wrap(
                spacing: IgongoSpace.sm,
                runSpacing: IgongoSpace.sm,
                children: [
                  for (var i = 0; i < _occasions.length; i++)
                    FlowSelectChip(
                      label: _occasions[i],
                      selected: _occasion == i,
                      onTap: () => setState(() => _occasion = i),
                    ),
                ],
              ),
              const SizedBox(height: IgongoSpace.md),
              Text('Dietary & cottage wishes', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: IgongoSpace.xs),
              TextField(
                minLines: 2,
                maxLines: 4,
                decoration: InputDecoration(
                  hintText: 'For example vegetarian preference, fresh passion juice on arrival, extra pillows',
                  filled: true,
                  fillColor: palette.surfaceAlt,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(IgongoRadius.md),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: IgongoSpace.md),
              Text('Preferred guide & host language', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: IgongoSpace.xs),
              Wrap(
                spacing: IgongoSpace.sm,
                runSpacing: IgongoSpace.sm,
                children: [
                  for (var i = 0; i < _languages.length; i++)
                    FlowSelectChip(
                      label: _languages[i],
                      selected: _language == i,
                      onTap: () => setState(() => _language = i),
                    ),
                ],
              ),
              const SizedBox(height: IgongoSpace.md),
              Text('Estimated check-in arrival', style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
              const SizedBox(height: IgongoSpace.xs),
              for (var i = 0; i < _arrivals.length; i++)
                Padding(
                  padding: const EdgeInsets.only(bottom: IgongoSpace.xs),
                  child: FlowSelectChip(
                    label: _arrivals[i],
                    icon: Icons.schedule,
                    selected: _arrival == i,
                    onTap: () => setState(() => _arrival = i),
                  ),
                ),
            ],
          ),
          const SizedBox(height: IgongoSpace.lg),
          // Special arrangements: the hospitality desk, call or WhatsApp.
          _FieldCard(
            children: [
              Text('Have special arrangements?', style: context.text.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
              Text('Direct line to the royal hospitality desk in Biharwe, Mbarara.',
                  style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
              const SizedBox(height: IgongoSpace.sm),
              Row(
                children: [
                  Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.call), label: const Text('Call desk'))),
                  const SizedBox(width: IgongoSpace.sm),
                  Expanded(child: OutlinedButton.icon(onPressed: () {}, icon: const Icon(Icons.chat), label: const Text('WhatsApp'))),
                ],
              ),
            ],
          ),
        ],
      ),
      bottomNavigationBar: const FlowBottomBar(
        caption: 'Required commitment (deposit)',
        amount: kAmountPlaceholder,
        buttonLabel: 'Proceed to deposit lock',
        icon: Icons.arrow_forward,
      ),
    );
  }

  /// The celebration choices, with None first.
  static const List<String> _occasions = ['None', 'Birthday', 'Anniversary', 'Honeymoon', 'Retreat'];

  /// The host languages offered.
  static const List<String> _languages = ['English', 'Runyankore', 'Luganda', 'Swahili'];

  /// The arrival windows offered.
  static const List<String> _arrivals = [
    'Early arrival (12:00 PM – 2:00 PM)',
    'Standard check-in (2:00 PM – 4:00 PM)',
    'Sunset arrival (4:00 PM – 7:00 PM)',
    'Late safari evening (after 7:00 PM)',
  ];
}

/// The four-stage progress bar with the current stage filled in red.
class _ProgressBar extends StatelessWidget {
  const _ProgressBar({required this.steps, required this.current});

  final List<String> steps;
  final int current;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    // Step 1: the label line, "Step n of 4" and the next stage.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text('Step ${current + 1} of ${steps.length}', style: context.text.labelMedium?.copyWith(color: palette.primary)),
            const Spacer(),
            Text('Next: ${steps[current + 1 < steps.length ? current + 1 : current]}',
                style: context.text.labelSmall?.copyWith(color: palette.textMuted)),
          ],
        ),
        const SizedBox(height: IgongoSpace.xs),
        // Step 2: one segment per stage, filled up to the current one.
        Row(
          children: [
            for (var i = 0; i < steps.length; i++) ...[
              Expanded(
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: i <= current ? palette.primary : palette.border,
                    borderRadius: BorderRadius.circular(IgongoRadius.pill),
                  ),
                ),
              ),
              if (i < steps.length - 1) const SizedBox(width: IgongoSpace.xxs),
            ],
          ],
        ),
        const SizedBox(height: IgongoSpace.xs),
        Row(
          children: [
            for (var i = 0; i < steps.length; i++)
              Expanded(
                child: Text(
                  steps[i],
                  textAlign: i == 0 ? TextAlign.left : (i == steps.length - 1 ? TextAlign.right : TextAlign.center),
                  style: context.text.labelSmall?.copyWith(
                    color: i == current ? palette.primary : palette.textMuted,
                    fontWeight: i == current ? FontWeight.w700 : FontWeight.w400,
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

/// The reserved room card: a photo, the room name, the dates and the guests.
class _ReservedRoomCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.md),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: palette.border),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(IgongoRadius.md),
            child: const SizedBox(width: 72, height: 72, child: GuestPhoto(asset: 'assets/photos/hotel-cottage-gate.jpg')),
          ),
          const SizedBox(width: IgongoSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const FlowTag('Reserved room', solid: true),
                const SizedBox(height: IgongoSpace.xxs),
                Text('Royal Thatched Cottage', style: context.text.titleMedium?.copyWith(fontFamily: IgongoFonts.brand, color: palette.primary)),
                Text('Dates and guests from your selection', style: context.text.bodySmall?.copyWith(color: palette.textMuted)),
              ],
            ),
          ),
          IconButton(tooltip: 'Edit room', icon: Icon(Icons.edit_outlined, color: palette.primary), onPressed: () {}),
        ],
      ),
    );
  }
}

/// A numbered section title, optionally with a small badge on the right.
class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.number, required this.title, this.badge});

  final String number;
  final String title;
  final String? badge;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Row(
      children: [
        CircleAvatar(
          radius: 12,
          backgroundColor: palette.primaryContainer,
          child: Text(number, style: context.text.labelMedium?.copyWith(color: palette.primary)),
        ),
        const SizedBox(width: IgongoSpace.sm),
        Expanded(
          child: Text(title, style: context.text.titleLarge?.copyWith(color: palette.primary, fontFamily: IgongoFonts.brand)),
        ),
        if (badge != null) FlowTag(badge!),
      ],
    );
  }
}

/// A white card around a group of fields.
class _FieldCard extends StatelessWidget {
  const _FieldCard({required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Container(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      decoration: BoxDecoration(
        color: palette.surface,
        borderRadius: BorderRadius.circular(IgongoRadius.lg),
        border: Border.all(color: palette.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < children.length; i++) ...[
            children[i],
            if (i < children.length - 1) const SizedBox(height: IgongoSpace.md),
          ],
        ],
      ),
    );
  }
}

/// A labelled text field with an icon, a hint, and an optional prefix or trailing icon.
class _LabelledField extends StatelessWidget {
  const _LabelledField({required this.label, required this.hint, required this.icon, this.prefix, this.trailing});

  final String label;
  final String hint;
  final IconData icon;
  final String? prefix;
  final IconData? trailing;

  @override
  Widget build(BuildContext context) {
    final palette = context.palette;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: context.text.labelLarge?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: IgongoSpace.xs),
        TextField(
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefix == null ? Icon(icon, color: palette.textMuted) : null,
            prefixText: prefix == null ? null : '$prefix  ',
            suffixIcon: trailing == null ? null : Icon(trailing, color: palette.textMuted),
            filled: true,
            fillColor: palette.surfaceAlt,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(IgongoRadius.md), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
