// The staff orders board: open food orders, filtered by status, each with
// what to make, the guest's notes and allergies, and a button for the next
// step (start, ready, handed over). The kitchen display shows new and
// preparing orders; the expo screen shows ready ones.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../api/api_exception.dart';
import '../catalog/catalog.dart';
import '../format/ugx.dart';
import '../live/live_view.dart';
import '../screens/parts/purpose_text.dart';
import '../screens/parts/screen_list_view.dart';
import '../screens/screen_layout.dart';
import '../session/session_controller.dart';
import '../theme/theme.dart';
import '../ui/button/igongo_button.dart';
import '../ui/card/igongo_card.dart';
import '../ui/chip/status_chip.dart';
import '../ui/toast/igongo_toast.dart';
import 'board_order.dart';
import 'orders_board_providers.dart';

/// The filters staff can pick, with their words.
const _filters = {null: 'All open', 'received': 'New', 'preparing': 'Preparing', 'ready': 'Ready'};

/// The words on the button that moves an order to each status.
const _moveWords = {'preparing': 'Start', 'ready': 'Ready', 'delivered': 'Handed over'};

/// The orders board for [screen], starting on [status] (null for all open orders).
class OrdersBoardScreen extends ConsumerStatefulWidget {
  /// Creates the board.
  const OrdersBoardScreen(this.screen, {super.key, this.status});

  /// The screen's context.
  final ScreenContext screen;

  /// The status shown first.
  final String? status;

  @override
  ConsumerState<OrdersBoardScreen> createState() => _OrdersBoardScreenState();
}

class _OrdersBoardScreenState extends ConsumerState<OrdersBoardScreen> {
  late String? _status = widget.status;

  /// Moves [o] to [to], then reloads; the server's refusal shows as a toast.
  Future<void> _move(BoardOrder o, String to) async {
    try {
      await moveOrder(ref.read(apiClientProvider), o.id, to);
      if (mounted) showIgongoToast(context, 'Order ${o.number}: ${statusWords(to)}');
    } on ApiException catch (e) {
      if (mounted) showIgongoToast(context, e.message);
    }
    ref.invalidate(boardOrdersProvider(_status));
  }

  @override
  Widget build(BuildContext context) => LiveView<List<BoardOrder>>(
    screenName: widget.screen.spec.name,
    value: ref.watch(boardOrdersProvider(_status)),
    onRetry: () => ref.invalidate(boardOrdersProvider(_status)),
    sample: (_) => screenLayout(widget.screen),
    builder: (context, orders, _) {
      // Finished and cancelled orders stay off the open board.
      final open = orders.where((o) => o.status != 'delivered' && o.status != 'cancelled').toList();
      return RefreshIndicator(
        onRefresh: () => ref.refresh(boardOrdersProvider(_status).future),
        child: ScreenListView(
          children: [
            PurposeText(widget.screen.spec.purpose),
            // Step 1: the status filters.
            SizedBox(
              height: 48,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.all(IgongoSpace.sm),
                children: [
                  for (final MapEntry(key: key, value: words) in _filters.entries)
                    Padding(
                      padding: const EdgeInsets.only(right: IgongoSpace.sm),
                      child: ChoiceChip(
                        label: Text(words),
                        selected: _status == key,
                        onSelected: (_) => setState(() => _status = key),
                      ),
                    ),
                ],
              ),
            ),
            // Step 2: each order with its next step.
            if (open.isEmpty)
              const Padding(padding: EdgeInsets.all(IgongoSpace.lg), child: Text('No open orders right now.')),
            for (final o in open)
              Padding(
                padding: const EdgeInsets.fromLTRB(IgongoSpace.lg, 0, IgongoSpace.lg, IgongoSpace.md),
                child: IgongoCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: IgongoSpace.xs,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text('${o.number}  ·  ${statusWords(o.type)}', style: context.text.titleMedium),
                          ),
                          StatusChip(statusWords(o.status)),
                        ],
                      ),
                      if (o.table != null) Text('Table ${o.table}', style: context.text.bodySmall),
                      for (final line in o.lines) Text(line),
                      if (o.allergies != null) Text('Allergies: ${o.allergies}', style: context.text.bodySmall),
                      if (o.notes != null) Text('Notes: ${o.notes}', style: context.text.bodySmall),
                      Wrap(
                        spacing: IgongoSpace.sm,
                        children: [
                          for (final to in o.next)
                            IgongoButton(label: _moveWords[to] ?? statusWords(to), onPressed: () => _move(o, to)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      );
    },
  );
}
