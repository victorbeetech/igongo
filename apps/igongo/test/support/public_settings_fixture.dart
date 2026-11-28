// Test-only public settings: the hotel details and content the super admin would
// have set. Tests use this through a provider override, so no network is needed.
// The app itself never reads these values from code.

import 'package:igongo/shared/hotel/application/public_settings_providers.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:igongo/shared/hotel/domain/hotel_content_item.dart';
import 'package:igongo/shared/hotel/domain/hotel_profile.dart';
import 'package:igongo/shared/hotel/domain/public_settings.dart';

/// The settings every screen test sees: one banner, one finding, one trending item and the hotel details.
const testPublicSettings = PublicSettings(
  hotel: HotelProfile(
    name: 'Igongo Test Hotel',
    address: 'Test Road, Mbarara',
    phone: '+256 000 000 001',
    whatsapp: '256000000002',
    email: 'front@example.test',
  ),
  banners: [
    HotelContentItem(id: 'b1', title: 'Heritage Suite', subtitle: 'Two nights', imageFileId: '', screen: ''),
  ],
  findings: [
    HotelContentItem(id: 'f1', title: 'Lakeside tilapia', subtitle: 'Kitchen', imageFileId: '', screen: ''),
  ],
  trending: [
    HotelContentItem(id: 't1', title: 'Eclipse monument hike', subtitle: 'Hill walk', imageFileId: '', screen: ''),
  ],
);

/// What the super admin has not set yet: no banners, findings, trending items or contact details.
/// The store screenshots use it so the pictures show only what the app shows on a fresh install.
const emptyPublicSettings = PublicSettings(
  hotel: HotelProfile(name: '', address: '', phone: '', whatsapp: '', email: ''),
  banners: [],
  findings: [],
  trending: [],
);

/// The override that serves [settings] in place of the network read.
Override publicSettingsFixture([PublicSettings settings = testPublicSettings]) =>
    publicSettingsProvider.overrideWith((ref) async => settings);
