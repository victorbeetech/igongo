// The cart's total in whole shillings: each line's unit price times its quantity.
// Shown on the Food tab's Your Order bar. The API prices the order again at checkout.

import 'cart.dart';

/// The cart's total in whole shillings, before any delivery or service charge.
int cartTotalOf(Cart cart) {
  // Step 1: add up each line's unit price times how many of it there are.
  var total = 0;
  for (final line in cart.lines) {
    total += line.unitPrice * line.quantity;
  }
  // Step 2: the sum.
  return total;
}
