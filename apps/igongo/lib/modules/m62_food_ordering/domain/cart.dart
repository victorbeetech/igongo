// The guest's cart: which outlet it is for and its lines. Shared by the
// cart controller (application) and the saved-cart API (data).

import 'cart_line.dart';

/// The cart: the outlet (null when empty) and its lines.
typedef Cart = ({String? outlet, List<CartLine> lines});
