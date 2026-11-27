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

import '../../../shared/ui/photo/guest_photos.dart';
import '../domain/delivery_zone.dart';
import '../domain/menu_item.dart';
import '../domain/option_choice.dart';
import '../domain/option_group.dart';
import '../domain/outlet.dart';

/// Switch for the demo menu. Set to false to hide it everywhere.
const bool demoMenuOn = true;

/// The key of the demo outlet (never sent to the server).
const String demoOutletKey = 'demo-restaurant';

/// The key of the second demo restaurant (it shares the demo dishes).
const String demoKaahwaKey = 'demo-kaahwa';

/// The key of the third demo restaurant (it also shares the demo dishes).
const String demoGrillKey = 'demo-grill';

/// The demo outlet list, shown only when the server has no outlets.
const List<Outlet> demoOutlets = [
  Outlet(key: demoOutletKey, name: 'Demo restaurant'),
  Outlet(key: demoKaahwaKey, name: 'Kaahwa Kanuzire'),
  Outlet(key: demoGrillKey, name: 'Lakeside Grill'),
];

/// Every demo outlet key, used to tell a demo outlet from a real one.
const List<String> demoOutletKeys = [demoOutletKey, demoKaahwaKey, demoGrillKey];

/// Whether [outlet] is a demo outlet and the demo is switched on.
bool isDemoOutlet(String outlet) => demoMenuOn && demoOutletKeys.contains(outlet);

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
    photoUrl: GuestPhotos.foodFish,
  ),
  MenuItem(
    id: 'demo-rolex',
    section: 'Snacks',
    name: 'Rolex',
    price: 5000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['egg', 'gluten'],
    photoUrl: GuestPhotos.foodFishPlated,
  ),
  MenuItem(
    id: 'demo-matooke',
    section: 'Local',
    name: 'Matooke and groundnut sauce',
    price: 15000,
    available: true,
    options: [_drinkAddOn],
    allergens: ['nuts'],
    photoUrl: GuestPhotos.foodDish,
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
