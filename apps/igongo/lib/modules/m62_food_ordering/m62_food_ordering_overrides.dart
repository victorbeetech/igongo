// The hand-made screens of module 62 (Food Ordering), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import '../../shared/orders_board/orders_board_screen.dart';
import 'presentation/my_orders_screen.dart';
import 'presentation/order_food_screen.dart';

/// Module 62's hand-made screens.
final m62Overrides = <String, ScreenOverride>{
  for (final id in ['S62-01', 'S62-02', 'S62-03', 'S62-04', 'S62-05', 'S62-06', 'S62-07', 'S62-08'])
    id: (_, s) => OrderFoodScreen(s),
  for (final id in ['S62-09', 'S62-10', 'S62-11']) id: (_, s) => MyOrdersScreen(s),
  // Staff: the orders board, and taking an order for a guest at the counter or table.
  for (final id in ['S62-12', 'S62-13']) id: (_, s) => OrdersBoardScreen(s),
  for (final id in ['S62-14', 'S62-15']) id: (_, s) => OrderFoodScreen(s),
};
