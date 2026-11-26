// S84-01 Stock home and S84-03 Items on the app: every item with its stock on
// hand (or only the low ones), pull to refresh. Signed out, the prototype
// design shows.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/chip/status_chip.dart';
import '../../../shared/ui/kpi/kpi_card.dart';
import '../application/stock_providers.dart';
import '../domain/stock_item.dart';

/// The items list; with [lowOnly], the home's low-stock view.
class StockItemsScreen extends ConsumerWidget {
  /// Creates the screen.
  const StockItemsScreen(this.screen, {super.key, this.lowOnly = false});

  /// The screen's context.
  final ScreenContext screen;

  /// Only items at or below their reorder level.
  final bool lowOnly;

  @override
  Widget build(BuildContext context, WidgetRef ref) => LiveView<List<StockItem>>(
    screenName: screen.spec.name,
    value: ref.watch(stockItemsProvider(lowOnly)),
    onRetry: () => ref.invalidate(stockItemsProvider(lowOnly)),
    sample: (_) => screenLayout(screen),
    builder: (context, items, _) => RefreshIndicator(
      onRefresh: () => ref.refresh(stockItemsProvider(lowOnly).future),
      child: ScreenListView(
        children: [
          PurposeText(screen.spec.purpose),
          if (lowOnly)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
              child: KpiCard(label: 'Items low on stock', value: '${items.length}'),
            ),
          if (items.isEmpty)
            Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Text(lowOnly ? 'Nothing is below its reorder level.' : 'No items yet.'),
            ),
          for (final i in items)
            ListTile(
              title: Text('${i.code} · ${i.name}'),
              subtitle: Text(i.onHandText),
              trailing: StatusChip(i.low ? 'Low' : 'OK'),
            ),
        ],
      ),
    ),
  );
}
