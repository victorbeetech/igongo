// The hand-made screens of module 84 (Stock & Inventory), live from the API:
// the stock ledger screens here, and requisitions and purchase requests on
// the shared record screens. Every other screen uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/records/domain/record_place.dart';
import '../../shared/records/presentation/record_screens.dart';
import 'domain/move_kind.dart';
import 'presentation/stock_items_screen.dart';
import 'presentation/stock_move_screen.dart';

/// The paperwork desk, a records-kit module.
const _desk = RecordPlace(path: '/api/stock/desk', module: 'stock-inventory');

/// Module 84's hand-made screens.
final m84Overrides = <String, ScreenOverride>{
  'S84-01': (_, s) => StockItemsScreen(s, lowOnly: true),
  'S84-03': (_, s) => StockItemsScreen(s),
  'S84-07': (_, s) => StockMoveScreen(s, MoveKind.receive),
  'S84-10': (_, s) => StockMoveScreen(s, MoveKind.issue),
  'S84-11': (_, s) => StockMoveScreen(s, MoveKind.transfer),
  'S84-17': (_, s) => StockMoveScreen(s, MoveKind.waste),
  'S84-15': (_, s) => StockMoveScreen(s, null),
  ...recordScreens(_desk, {
    'S84-08': list(types: ['requisition']),
    'S84-09': form(types: ['requisition']),
    'S84-12': list(types: ['purchase_request']),
  }),
};
