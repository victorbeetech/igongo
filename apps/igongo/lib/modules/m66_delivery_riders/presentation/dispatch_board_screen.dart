// S66-01 Dispatch board: deliveries waiting for a rider (with the riders
// online now to give each one to), deliveries on the way, and the last 12
// hours' finished ones. The server checks the dispatcher's permission.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/api/api_exception.dart';
import '../../../shared/catalog/catalog.dart';
import '../../../shared/format/ugx.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/list_row/igongo_list_row.dart';
import '../../../shared/ui/section/section_header.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/delivery_providers.dart';
import '../domain/delivery_job.dart';
import '../domain/dispatch_board.dart';

/// The dispatcher's board.
class DispatchBoardScreen extends ConsumerWidget {
  /// Creates the board for [screen].
  const DispatchBoardScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// Asks which online rider takes [job], then assigns it.
  Future<void> _assign(BuildContext context, WidgetRef ref, DeliveryJob job, List<OnlineRider> riders) async {
    if (riders.isEmpty) return showIgongoToast(context, 'No rider is online right now.');
    final rider = await showModalBottomSheet<OnlineRider>(
      context: context,
      builder: (c) => ListView(
        shrinkWrap: true,
        children: [
          for (final r in riders)
            ListTile(leading: const Icon(Icons.two_wheeler), title: Text(r.name), onTap: () => Navigator.of(c).pop(r)),
        ],
      ),
    );
    if (rider == null) return;
    try {
      await ref.read(deliveryApiProvider).assign(job.id, rider.userId);
      if (context.mounted) showIgongoToast(context, '${job.orderNumber} given to ${rider.name}');
    } on ApiException catch (e) {
      if (context.mounted) showIgongoToast(context, e.message);
    }
    ref.invalidate(dispatchBoardProvider);
  }

  /// One job as a row; [onTap] assigns it when given.
  Widget _row(DeliveryJob j, {VoidCallback? onTap}) => IgongoListRow(
    title: '${j.orderNumber}  ·  ${j.customerName}',
    subtitle: [j.placeLabel, if (j.cashToCollect > 0) 'collect ${ugx(j.cashToCollect)}'].join('  ·  '),
    status: statusWords(j.status),
    onTap: onTap,
  );

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<DispatchBoard>(
    screenName: screen.spec.name,
    value: ref.watch(dispatchBoardProvider),
    onRetry: () => ref.invalidate(dispatchBoardProvider),
    sample: (_) => screenLayout(screen),
    builder: (context, board, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(dispatchBoardProvider.future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          // Step 1: waiting jobs; tap one to give it to a rider.
          SectionHeader('Waiting (${board.waiting.length}), ${board.riders.length} riders online'),
          if (board.waiting.isEmpty)
            const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('Nothing waiting.')),
          for (final j in board.waiting) _row(j, onTap: () => _assign(context, ref, j, board.riders)),
          // Step 2: on the way.
          SectionHeader('On the way (${board.active.length})'),
          for (final j in board.active) _row(j),
          // Step 3: finished in the last 12 hours.
          SectionHeader('Finished today (${board.done.length})'),
          for (final j in board.done) _row(j),
        ],
      ),
    ),
  );
}
