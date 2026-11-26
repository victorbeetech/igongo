// Turns a records module's short screen map into its hand-made app
// screens, so each module's overrides file is a few lines of data. Settings
// screens open the list of the module's types (the settings themselves are
// edited on the web portal).
//
//   recordScreens(place, {'S46-01': list(types: ['found']), 'S46-04': form(types: ['lost'])})

import '../../catalog/catalog.dart';
import '../domain/record_place.dart';
import 'record_form_screen.dart';
import 'record_list_screen.dart';
import 'record_scan_screen.dart';

/// How one screen uses the shared record screens.
typedef RecordScreen = ScreenOverride Function(RecordPlace place);

/// A list of records.
RecordScreen list({List<String> types = const [], bool mine = false, bool assigned = false, bool canAdd = true}) =>
    (place) =>
        (_, s) => RecordListScreen(s, place, types: types, mine: mine, assigned: assigned, canAdd: canAdd);

/// An add form.
RecordScreen form({List<String> types = const []}) =>
    (place) =>
        (_, s) => RecordFormScreen(s, place, types: types);

/// Find by code.
RecordScreen scan() =>
    (place) =>
        (_, s) => RecordScanScreen(s, place);

/// The module's screens for [place].
Map<String, ScreenOverride> recordScreens(RecordPlace place, Map<String, RecordScreen> screens) => {
  for (final e in screens.entries) e.key: e.value(place),
};
