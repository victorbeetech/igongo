// The eight Resort Experiences tiles on the Bookings tab, in the order of the
// design. Each one opens its existing screen; the captions are fixed copy.
// Pictures are placeholders where the hotel has not sent one yet.

import 'package:material_ui/material_ui.dart';

import '../../ui/photo/guest_photos.dart';
import 'resort_experience.dart';

/// The eight experiences: accommodation, dining, museum, hike, pool, spa, events and the craft shop.
const resortExperiences = <ResortExperience>[
  ResortExperience(
    label: 'Accommodations',
    caption: 'Chalets & executive rooms',
    icon: Icons.bed_outlined,
    screenId: 'S67-02',
    photo: GuestPhotos.hotelCottages,
  ),
  ResortExperience(
    label: 'Dining & Bars',
    caption: 'Kaahwa Kanuzire terrace',
    icon: Icons.restaurant_outlined,
    screenId: 'S62-01',
    photo: GuestPhotos.hotelKaahwaKanuzire,
  ),
  ResortExperience(
    label: 'Erijukiro Museum',
    caption: 'Guided cultural tours',
    icon: Icons.account_balance_outlined,
    screenId: 'S68-01',
    photo: GuestPhotos.hotelCulturalHut,
  ),
  // No screen for the hike yet, so this tile has no tap action (placeholder).
  ResortExperience(label: 'Eclipse Hill', caption: 'Lore & guided hike', icon: Icons.landscape_outlined),
  ResortExperience(
    label: 'Heated Pool',
    caption: 'Day pass & loungers',
    icon: Icons.pool_outlined,
    screenId: 'S71-01',
    photo: GuestPhotos.hotelPool,
  ),
  ResortExperience(label: 'Spa & Sauna', caption: 'Ankole herbal therapy', icon: Icons.spa_outlined, screenId: 'S72-01'),
  ResortExperience(label: 'Conferences', caption: 'Weddings & banquets', icon: Icons.groups_outlined, screenId: 'S69-01'),
  ResortExperience(label: 'Craft Village', caption: 'Horn & honey gifts', icon: Icons.shopping_bag_outlined, screenId: 'S73-01'),
];
