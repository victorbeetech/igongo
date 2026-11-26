// S66-10 The delivery tracker, live: everything on its way to the guest
// (food, shop items, laundry, a room service tray, a parcel), each with its
// steps, the rider, the arrival time, the rider's last position while on
// the road, and the 4-digit code to give at the door; then the last 30
// days' finished deliveries. Asks again every 15 seconds while anything is
// on its way. The live map needs the Google Maps key, so it shows as a
// labelled preview until then. Signed out, the prototype design shows.

import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/format/when.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/banner/status_banner.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/chip/status_chip.dart';
import '../../../shared/ui/section/section_header.dart';
import '../application/delivery_providers.dart';
import '../domain/tracked_delivery.dart';

/// The guest's delivery tracker.
class MyDeliveriesScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const MyDeliveriesScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<MyDeliveriesScreen> createState() => _MyDeliveriesScreenState();
}

class _MyDeliveriesScreenState extends ConsumerState<MyDeliveriesScreen> {
  Timer? _tick;

  @override
  void initState() {
    super.initState();
    // Ask again while something is on its way; nothing to ask when all are done.
    _tick = Timer.periodic(trackerRefresh, (_) {
      final now = ref.read(myDeliveriesProvider).valueOrNull;
      if (now != null && now.active.isNotEmpty) ref.invalidate(myDeliveriesProvider);
    });
  }

  @override
  void dispose() {
    _tick?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => LiveView(
    screenName: widget.screen.spec.name,
    value: ref.watch(myDeliveriesProvider),
    onRetry: () => ref.invalidate(myDeliveriesProvider),
    sample: (_) => screenLayout(widget.screen),
    builder: (context, mine, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myDeliveriesProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(widget.screen.spec.purpose),
          if (mine.active.isEmpty && mine.done.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('Nothing is on its way to you.')),
          if (mine.active.isNotEmpty) ...[
            const SectionHeader('On the way'),
            const StatusBanner(
              tone: BannerTone.info,
              message: 'Preview: the live map opens once the hotel adds its Google Maps key.',
            ),
            for (final d in mine.active) _DeliveryCard(d),
          ],
          if (mine.done.isNotEmpty) ...[const SectionHeader('Finished'), for (final d in mine.done) _DeliveryCard(d)],
        ],
      ),
    ),
  );
}

/// One delivery: what, where, the steps, the rider and the door code.
class _DeliveryCard extends StatelessWidget {
  const _DeliveryCard(this.d);

  final TrackedDelivery d;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
    child: IgongoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.xs,
        children: [
          Row(
            children: [
              Expanded(child: Text('${d.reference} · ${sourceWords(d.source)}', style: context.text.titleMedium)),
              StatusChip(statusWords(d.status)),
            ],
          ),
          if (d.what case final what?) Text(what),
          Text('To ${d.place}', style: context.text.bodySmall),
          // The steps, ticked as they happen.
          for (final s in d.steps)
            Row(
              spacing: IgongoSpace.sm,
              children: [
                Icon(
                  s.done ? Icons.check_circle : Icons.radio_button_unchecked,
                  size: IgongoSpace.lg,
                  color: s.done ? context.palette.primary : context.palette.border,
                  semanticLabel: s.done ? 'Done' : 'Not yet',
                ),
                Expanded(child: Text(stepWords(s.step))),
                if (s.at case final at?) Text(dayTime(DateTime.parse(at)), style: context.text.bodySmall),
              ],
            ),
          if (d.active) ...[
            if (d.riderName case final rider?) Text('$rider is your rider'),
            if (d.eta case final eta?) Text('Arriving about ${dayTime(DateTime.parse(eta))}'),
            if (d.riderLat != null && d.riderLng != null)
              Text(
                'Rider last seen at ${d.riderLat!.toStringAsFixed(4)}, ${d.riderLng!.toStringAsFixed(4)}',
                style: context.text.bodySmall,
              ),
            if (d.cashToCollect > 0) Text('Have ${ugx(d.cashToCollect)} ready for the rider'),
            Text('Give the rider this code: ${d.code}', style: context.text.titleMedium),
          ],
          if (d.failReason case final why?) Text('Not delivered: $why', style: TextStyle(color: context.palette.error)),
        ],
      ),
    ),
  );
}
