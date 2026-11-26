// DEMO MENU for the food shop (module 62). Sample dishes so the food screens
// can be seen and tested before the kitchens enter their own menus.
//
// How it works:
//  * It shows only when the server has NO outlets for guests yet (a real
//    menu always wins), and only while [demoMenuOn] is true.
//  * Demo dishes can be added to the cart and ordered to try the whole flow,
//    but the order stays on the phone (see demo_orders.dart): nothing is sent
//    to a kitchen and nothing is charged.
//  * To switch it off, set [demoMenuOn] to false. Nothing else changes.
//
// Delete this whole file when the hotel's real menus are live.

import '../domain/delivery_zone.dart';
import '../domain/menu_item.dart';
import '../domain/option_choice.dart';
import '../domain/option_group.dart';
import '../domain/outlet.dart';

/// Switch for the demo menu. Set to false to hide it everywhere.
const bool demoMenuOn = true;

/// The key of the demo outlet (never sent to the server).
const String demoOutletKey = 'demo-restaurant';

/// The demo outlet list, shown only when the server has no outlets.
const List<Outlet> demoOutlets = [Outlet(key: demoOutletKey, name: 'Demo restaurant')];

/// Whether [outlet] is the demo outlet and the demo is switched on.
bool isDemoOutlet(String outlet) => demoMenuOn && outlet == demoOutletKey;

/// The demo delivery zone (so delivery can be tried).
const List<DeliveryZone> demoZones = [
  DeliveryZone(zone: 'demo-grounds', name: 'Lodge grounds', fee: 3000, minutes: 20),
];

/// A demo add-on: a drink with the meal (optional).
const _drinkAddOn = OptionGroup(
  key: 'drink',
  name: 'Add a drink',
  required: false,
  multiple: false,
  choices: [
    OptionChoice(key: 'passion', name: 'Passion juice', priceDelta: 6000),
    OptionChoice(key: 'soda', name: 'Soda', priceDelta: 3000),
  ],
);

/// The demo dishes. The last one is out today, so the "Not available" card shows.
const List<MenuItem> demoMenuItems = [
  MenuItem(
    id: 'demo-tilapia',
    section: 'Grill',
    name: 'Grilled tilapia',
    price: 28000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['fish'],
    description: 'Whole tilapia on the grill with greens.',
  ),
  MenuItem(
    id: 'demo-rolex',
    section: 'Snacks',
    name: 'Rolex',
    price: 5000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['egg', 'gluten'],
  ),
  MenuItem(
    id: 'demo-matooke',
    section: 'Local',
    name: 'Matooke and groundnut sauce',
    price: 15000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['nuts'],
  ),
  MenuItem(
    id: 'demo-passion',
    section: 'Drinks',
    name: 'Fresh passion juice',
    price: 6000,
    available: true,
    options: [],
    allergens: [],
  ),
  MenuItem(
    id: 'demo-luwombo',
    section: 'Local',
    name: 'Chicken luwombo',
    price: 35000,
    available: false,
    options: [],
    allergens: ['nuts'],
  ),
  // A takeaway container, sold as an extra (offered at takeaway checkout, not shown as a dish).
  MenuItem(
    id: 'demo-container',
    section: 'Extras',
    name: 'Takeaway container',
    price: 1000,
    available: true,
    options: [],
    allergens: [],
  ),
];
