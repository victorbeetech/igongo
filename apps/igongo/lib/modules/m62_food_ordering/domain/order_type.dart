// The ways to order food, with words for people. The super admin switches
// each on per outlet (S62-16); `pre_order` is "I'm coming at 4 PM".

/// Order types, in the order the app offers them.
const orderTypes = ['delivery', 'room_service', 'dine_in', 'takeaway', 'pre_order'];

/// Words for [type].
String orderTypeWords(String type) => switch (type) {
  'delivery' => 'Delivery',
  'room_service' => 'Room service',
  'dine_in' => 'Dine-in',
  'takeaway' => 'Takeaway',
  'pre_order' => "Pre-order (I'm coming)",
  _ => type,
};
