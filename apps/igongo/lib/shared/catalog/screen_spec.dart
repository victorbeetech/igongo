// What one screen of the approved inventory is: its number, name, route,
// kind and where it leads. The generated module files are lists of these.

/// The kind of a screen decides which shared layout draws it. Kinds come from
/// the screen's name, by the same rule the approved wireframes used.
enum ScreenKind {
  /// A hub of tiles, such as a role home or a module home.
  home,

  /// Numbers, a chart and the latest items.
  dashboard,

  /// Waits for an NFC card, wristband or QR code.
  scanner,

  /// A map or floor plan.
  map,

  /// Switches and choices the super admin or a manager sets.
  settings,

  /// A drag and drop builder with a canvas and a properties panel.
  builder,

  /// A form that collects details and submits them.
  form,

  /// One record with its details and history.
  detail,

  /// The outcome of a step: done, refused, not found and so on.
  result,

  /// A searchable, filterable list of records.
  list,
}

/// Where a screen is used, from the inventory's surface letters.
enum Surface {
  /// The Igongo app on Android and iOS.
  app,

  /// The web portal for staff and the super admin.
  web,

  /// A shared device: the gate reader, kitchen display or canteen tablet.
  kiosk,

  /// A public page with no sign-in.
  public,
}

/// One screen from the approved screen inventory.
class ScreenSpec {
  /// Creates a screen description. Only the generator calls this.
  const ScreenSpec({
    required this.id,
    required this.name,
    required this.purpose,
    required this.route,
    required this.kind,
    required this.surfaces,
    this.opens = const [],
    this.dialogs = const [],
    this.fields = const [],
  });

  /// The screen number, such as S16-09.
  final String id;

  /// The screen name people see in the title bar.
  final String name;

  /// What the screen is for, in one line.
  final String purpose;

  /// The route, the same on the app and the web. `:id` marks a record screen.
  final String route;

  /// Which shared layout draws this screen.
  final ScreenKind kind;

  /// Where the screen is used.
  final List<Surface> surfaces;

  /// Screen numbers this screen opens, or `home` for the role home.
  final List<String> opens;

  /// Dialog numbers this screen opens.
  final List<String> dialogs;

  /// Form field labels, when the inventory names them.
  final List<String> fields;

  /// The module code, taken from the screen number (S16-09 is module 16).
  String get module => id.substring(1, 3);

  /// Whether this screen belongs in the app (phone or kiosk).
  bool get inApp => surfaces.contains(Surface.app) || surfaces.contains(Surface.kiosk);
}
