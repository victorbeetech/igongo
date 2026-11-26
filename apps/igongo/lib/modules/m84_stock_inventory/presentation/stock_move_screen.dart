// S84-07 Receive goods, S84-10 Issue stock, S84-11 Transfers, S84-17 Wastage
// and S84-15 Stock count on the app: pick the item and the store(s), type
// the quantity, save to the stock ledger. A count books the difference.

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../shared/catalog/catalog.dart';
import '../../../shared/live/live_view.dart';
import '../../../shared/screens/parts/purpose_text.dart';
import '../../../shared/screens/parts/screen_list_view.dart';
import '../../../shared/screens/screen_layout.dart';
import '../../../shared/ui/button/igongo_button.dart';
import '../../../shared/ui/field/igongo_field.dart';
import '../../../shared/ui/toast/igongo_toast.dart';
import '../application/stock_providers.dart';
import '../domain/move_kind.dart';
import '../domain/stock_item.dart';
import '../domain/stock_store.dart';
import 'stock_form.dart';

/// One movement form; a stock count when [kind] is null.
class StockMoveScreen extends ConsumerStatefulWidget {
  /// Creates the screen.
  const StockMoveScreen(this.screen, this.kind, {super.key});

  /// The screen's context.
  final ScreenContext screen;

  /// What it posts, or null for a count.
  final MoveKind? kind;

  @override
  ConsumerState<StockMoveScreen> createState() => _StockMoveScreenState();
}

class _StockMoveScreenState extends ConsumerState<StockMoveScreen> {
  String? _item;
  String? _from;
  String? _to;
  final _qty = TextEditingController();
  final _ref = TextEditingController();
  final _note = TextEditingController();
  bool _busy = false;

  @override
  void dispose() {
    for (final c in [_qty, _ref, _note]) {
      c.dispose();
    }
    super.dispose();
  }

  /// Text as null when blank.
  String? _opt(TextEditingController c) => c.text.trim().isEmpty ? null : c.text.trim();

  /// Checks the form, posts it and clears it.
  Future<void> _save() async {
    final kind = widget.kind;
    // Step 1: everything this kind needs is filled in.
    final qty = double.tryParse(_qty.text.trim());
    final ready =
        _item != null &&
        qty != null &&
        (kind == null
            ? qty >= 0 && _from != null
            : qty > 0 && (!kind.from || _from != null) && (!kind.to || _to != null));
    if (!ready) {
      showIgongoToast(context, 'Choose the item and store, and type the quantity.');
      return;
    }
    // Step 2: post it to the ledger.
    setState(() => _busy = true);
    try {
      final api = ref.read(stockApiProvider);
      if (kind == null) {
        await api.count(itemId: _item!, storeId: _from!, counted: qty, note: _opt(_note));
      } else {
        await api.move(
          kind,
          itemId: _item!,
          qty: qty,
          fromStoreId: kind.from ? _from : null,
          toStoreId: kind.to ? _to : null,
          reference: _opt(_ref),
          note: _opt(_note),
        );
      }
      // Step 3: confirm, refresh the balances and clear the quantity.
      if (!mounted) return;
      showIgongoToast(context, 'Saved to the stock ledger');
      ref.invalidate(stockItemsProvider);
      _qty.clear();
      _note.clear();
    } on Exception catch (e) {
      if (mounted) showIgongoToast(context, '$e');
    }
    if (mounted) setState(() => _busy = false);
  }

  @override
  Widget build(BuildContext context) {
    final kind = widget.kind;
    return LiveView<List<StockStore>>(
      screenName: widget.screen.spec.name,
      value: ref.watch(stockStoresProvider),
      onRetry: () => ref.invalidate(stockStoresProvider),
      sample: (_) => screenLayout(widget.screen),
      builder: (context, stores, _) {
        final items = ref.watch(stockItemsProvider(false)).valueOrNull ?? const <StockItem>[];
        return ScreenListView(
          children: [
            PurposeText(widget.screen.spec.purpose),
            Padding(
              padding: const EdgeInsets.all(IgongoSpace.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: IgongoSpace.md,
                children: [
                  itemPicker(items, _item, (v) => setState(() => _item = v)),
                  if (kind == null || kind.from)
                    storePicker(
                      kind == null ? 'Store counted' : 'Out of store',
                      stores,
                      _from,
                      (v) => setState(() => _from = v),
                    ),
                  if (kind != null && kind.to)
                    storePicker(
                      'Into store',
                      stores,
                      _to,
                      (v) => setState(() => _to = v),
                      mineOnly: kind != MoveKind.transfer,
                    ),
                  IgongoField(
                    label: kind == null ? 'Counted on the shelf' : 'Quantity (base units)',
                    controller: _qty,
                    keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  ),
                  if (kind != null)
                    IgongoField(
                      label: kind == MoveKind.issue ? 'Issued to' : 'Reference (order or requisition code)',
                      controller: _ref,
                    ),
                  IgongoField(label: kind == MoveKind.waste ? 'Reason' : 'Note', controller: _note),
                  IgongoButton(label: kind?.label ?? 'Save count', onPressed: _busy ? null : _save),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
