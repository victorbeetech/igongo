// DEMO ORDERS (part of the demo menu, see demo_menu.dart). Placing an order
// on the demo outlet is kept here in memory only: nothing is sent to the
// kitchen or the server, nothing is charged, and the orders vanish when the
// app closes. They show in "My orders" with a DEMO number so they can never
// be mistaken for real ones. Delete with demo_menu.dart.

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../domain/cart_line.dart';
import '../domain/order.dart';
import '../domain/order_line.dart';
import 'demo_menu.dart';

/// The order types the demo outlet offers.
/// The demo's takeaway container price (the real fee is the super admin's rule; 0 there means free).
const demoContainerFee = 1000;

const List<String> demoOrderTypes = ['dine_in', 'takeaway', 'delivery'];

/// The demo orders placed this run, newest first.
class DemoOrders extends Notifier<List<Order>> {
  @override
  List<Order> build() => const [];

  /// Places a demo order for [lines] of [type]; returns it.
  Order place(List<CartLine> lines, String type) {
    final total = lines.fold(0, (sum, l) => sum + l.unitPrice * l.quantity);
    final order = Order(
      id: 'demo-${state.length + 1}',
      number: 'DEMO-${(state.length + 1).toString().padLeft(4, '0')}',
      outlet: demoOutletKey,
      type: type,
      status: 'preparing',
      lines: [
        for (final l in lines) OrderLine(name: l.name, quantity: l.quantity, lineTotal: l.unitPrice * l.quantity),
      ],
      total: total,
      paid: total,
      readyAt: DateTime.now().add(const Duration(minutes: 20)).toUtc().toIso8601String(),
    );
    state = [order, ...state];
    return order;
  }
}

/// The demo orders of this run.
final demoOrdersProvider = NotifierProvider<DemoOrders, List<Order>>(DemoOrders.new);
