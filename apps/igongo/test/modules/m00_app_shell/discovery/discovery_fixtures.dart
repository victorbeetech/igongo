// Test-only sample items for the search discovery widgets. They live in the test
// folder only; the app itself reads the super admin's content and never shows these.

import 'package:igongo/shared/hotel/domain/hotel_content_item.dart';

/// Three findings, written the way the admin would enter them.
const testFindings = <HotelContentItem>[
  HotelContentItem(id: 'f1', title: 'Grilled Tilapia at the lakeside', subtitle: 'Kitchen', imageFileId: '', screen: 'S62-01'),
  HotelContentItem(id: 'f2', title: 'Heritage Cottage', subtitle: 'Stay', imageFileId: '', screen: 'S67-01'),
  HotelContentItem(id: 'f3', title: 'Longhorn cultural tour', subtitle: 'Museum', imageFileId: '', screen: ''),
];

/// Two trending experiences.
const testTrending = <HotelContentItem>[
  HotelContentItem(id: 't1', title: 'Eclipse monument hike', subtitle: 'Hill walk', imageFileId: '', screen: ''),
  HotelContentItem(id: 't2', title: 'Herbal steam bath', subtitle: 'Spa', imageFileId: '', screen: ''),
];
