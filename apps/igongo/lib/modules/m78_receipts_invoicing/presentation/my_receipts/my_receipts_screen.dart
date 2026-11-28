// S78-06 My receipts: the guest's receipts. Shows the spend summary, category
// pills, receipts grouped by day, and the tax e-invoice banner. With no
// receipts it shows the empty state. Tapping a card opens the receipt sheet.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../shared/catalog/catalog.dart';
import '../../../../shared/ui/toast/igongo_toast.dart';
import '../../application/my_receipts_provider.dart';
import '../../application/receipt_groups.dart';
import '../../domain/guest_receipt.dart';
import '../../domain/receipt_category.dart';
import 'receipt_day_section.dart';
import 'receipt_empty_state.dart';
import 'receipt_filter_pills.dart';
import 'receipt_sheet.dart';
import 'receipt_spend_card.dart';
import 'tax_invoice_banner.dart';

/// The guest's receipts. [screen] is the screen's context from the catalogue.
class MyReceiptsScreen extends ConsumerStatefulWidget {
  /// Creates the screen for [screen].
  const MyReceiptsScreen(this.screen, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  @override
  ConsumerState<MyReceiptsScreen> createState() => _MyReceiptsScreenState();
}

class _MyReceiptsScreenState extends ConsumerState<MyReceiptsScreen> {
  /// The selected filter, or null for "All".
  ReceiptCategory? _filter;

  @override
  Widget build(BuildContext context) {
    // Step 1: read every receipt, then the shown ones after the filter.
    final all = ref.watch(myReceiptsProvider);
    // Step 2: no receipts at all shows the empty state instead of the list.
    if (all.isEmpty) {
      return ListView(
        padding: const EdgeInsets.all(IgongoSpace.lg),
        children: [ReceiptEmptyState(onExplore: () => showIgongoToast(context, 'Dining & Stays is coming soon'))],
      );
    }
    final shown = filterReceipts(all, _filter);
    final groups = groupReceiptsByDay(shown, DateTime.now());
    return ListView(
      padding: const EdgeInsets.only(bottom: IgongoSpace.xl),
      children: [
        // The spend summary on the crimson band.
        ReceiptSpendCard(
          total: all.fold(0, (sum, r) => sum + r.amount),
          settled: all.length,
          points: all.fold(0, (sum, r) => sum + r.points),
          folio: 'Folio #IGN-2026-9041 • Checked in at Deluxe Cottage 04',
          onStatement: () => showIgongoToast(context, 'Statement is coming soon'),
        ),
        const SizedBox(height: IgongoSpace.md),
        // The category pills.
        ReceiptFilterPills(selected: _filter, allCount: all.length, onSelect: (c) => setState(() => _filter = c)),
        const SizedBox(height: IgongoSpace.md),
        // The receipts, grouped by day.
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: IgongoSpace.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: IgongoSpace.lg,
            children: [
              for (final g in groups) ReceiptDaySection(group: g, onOpen: (r) => _open(context, r)),
              TaxInvoiceBanner(onEmail: () => showIgongoToast(context, 'E-invoice is coming soon')),
            ],
          ),
        ),
      ],
    );
  }

  /// Opens the receipt sheet for [r].
  void _open(BuildContext context, GuestReceipt r) => showReceiptSheet(context, r);
}
