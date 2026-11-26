// The hand-made screens of module 58 (Campaigns), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 58's hand-made screens.
final m58Overrides = recordScreens(place, {'S58-01': list(), 'S58-02': form(), 'S58-03': list()});
