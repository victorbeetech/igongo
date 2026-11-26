// S66-03..09 Rider home, live: the online switch, today's trips, earnings
// and cash in hand, and each job with its next step (accept or decline,
// picked up, delivered with the guest's code, or could not deliver).
// Signed out, the prototype design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/theme/theme.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/card/igongo_card.dart';
import '../../../shared/ui/chip/status_chip.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/delivery_providers.dart';
import '../domain/delivery_job.dart';
import '../domain/rider_shift.dart';
import 'deliver_dialog.dart';

/// The rider's home.
class RiderHomeScreen extends ConsumerWidget {
  /// Creates the screen for [screen].
  const RiderHomeScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Runs [call], shows any refusal, then reloads the shift.
  Future<void> _run(BuildContext context, WidgetRef ref, Future<void> Function() call) async {
    try {
      await call();
    } on Exception catch (e) {
      if (context.mounted) showIgongoToast(context, '$e');
    }
    ref.invalidate(myShiftProvider);
  }

  /// Asks why a job could not be delivered, then reports it.
  Future<void> _fail(BuildContext context, WidgetRef ref, DeliveryJob job) async {
    final reason = TextEditingController();
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Could not deliver'),
        content: TextField(
          controller: reason,
          decoration: const InputDecoration(labelText: 'Why?'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(c).pop(false), child: const Text('Back')),
          TextButton(onPressed: () => Navigator.of(c).pop(true), child: const Text('Report')),
        ],
      ),
    );
    final why = reason.text.trim();
    reason.dispose();
    if (ok != true || !context.mounted) return;
    await _run(context, ref, () => ref.read(deliveryApiProvider).fail(job.id, why));
  }

  /// The buttons for [job]'s next step.
  List<Widget> _steps(BuildContext context, WidgetRef ref, DeliveryJob job) {
    final api = ref.read(deliveryApiProvider);
    return switch (job.status) {
      'assigned' => [
        IgongoButton(label: 'Accept', onPressed: () => _run(context, ref, () => api.step(job.id, 'accept'))),
        IgongoButton(
          label: 'Decline',
          variant: ButtonVariant.text,
          onPressed: () => _run(context, ref, () => api.step(job.id, 'decline')),
        ),
      ],
      'accepted' => [
        IgongoButton(label: 'Picked up', onPressed: () => _run(context, ref, () => api.step(job.id, 'pickup'))),
      ],
      'picked_up' => [
        IgongoButton(
          label: 'Delivered',
          onPressed: () async {
            final done = await showDialog<bool>(
              context: context,
              builder: (_) => DeliverDialog(job: job),
            );
            if (done ?? false) ref.invalidate(myShiftProvider);
          },
        ),
        IgongoButton(
          label: 'Could not deliver',
          variant: ButtonVariant.text,
          onPressed: () => _fail(context, ref, job),
        ),
      ],
      _ => const [],
    };
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<RiderShift>(
    screenName: screen.spec.name,
    value: ref.watch(myShiftProvider),
    onRetry: () => ref.invalidate(myShiftProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, shift, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(myShiftProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          SwitchListTile(
            title: Text(shift.online ? 'Online: taking jobs' : 'Offline'),
            value: shift.online,
            onChanged: (on) => _run(context, ref, () => ref.read(deliveryApiProvider).setOnline(on)),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
            child: Text(
              '${shift.tripsToday} trips · ${ugx(shift.earningsToday)} earned · ${ugx(shift.cashInHand)} cash in hand'
              '${shift.cashLimit > 0 ? ' (limit ${ugx(shift.cashLimit)})' : ''}',
              style: context.text.bodySmall,
            ),
          ),
          if (shift.current.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No jobs right now.')),
          for (final job in shift.current)
            Padding(
              padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, IgongoSpace.md, IgongoSpace.lg, 0),
              child: IgongoCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: IgongoSpace.xs,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text('${job.orderNumber} · ${job.customerName}', style: context.text.titleMedium),
                        ),
                        StatusChip(statusWords(job.status)),
                      ],
                    ),
                    Text(job.placeLabel),
                    if (job.customerPhone case final phone?) SelectableText(phone),
                    if (job.cashToCollect > 0) Text('Collect ${ugx(job.cashToCollect)} cash'),
                    Wrap(spacing: IgongoSpace.sm, children: _steps(context, ref, job)),
                  ],
                ),
              ),
            ),
        ],
      ),
    ),
  );
}
