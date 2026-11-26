// The hand-made screens of module 59 (Promotions and vouchers), live from the API
// through the shared record screens (the same engine as the API's records kit).
// Each line: which shared screen the screen uses, and which record types it shows.

import '../../shared/records/presentation/record_screens.dart';
import 'domain/place.dart';

/// Module 59's hand-made screens.
final m59Overrides = recordScreens(place, {
  'S59-01': list(types: ['promotion']),
  'S59-02': form(types: ['promotion']),
  'S59-03': list(types: ['voucher']),
  'S59-04': form(types: ['voucher']),
  'S59-05': list(types: ['voucher'], mine: true, canAdd: false),
  'S59-06': scan(),
});
