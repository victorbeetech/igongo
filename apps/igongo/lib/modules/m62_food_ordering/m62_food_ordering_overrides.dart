// The hand-made screens of module 62 (Food Ordering), live from the API.
// Every other screen of the module uses a shared layout.

import '../../shared/catalog/catalog.dart';
import 'presentation/my_orders_screen.dart';
import 'presentation/order_food_screen.dart';

/// Module 62's hand-made screens.
final m62Overrides = <String, ScreenOverride>{
  for (final id in ['S62-01', 'S62-02', 'S62-03', 'S62-04', 'S62-05', 'S62-06', 'S62-07', 'S62-08'])
    id: (_, s) => OrderFoodScreen(s),
  for (final id in ['S62-09', 'S62-10', 'S62-11']) id: (_, s) => MyOrdersScreen(s),
};
