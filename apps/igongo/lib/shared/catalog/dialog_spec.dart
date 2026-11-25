// What one dialog, sheet or confirmation of the approved inventory is.

/// How a dialog looks, from its name.
enum DialogTone {
  /// A plain confirmation with Cancel and Confirm.
  confirm,

  /// Asks before a step that removes or stops something. The confirm button is red.
  danger,

  /// Explains a problem, such as being offline or a failed chip write.
  warning,

  /// A bottom sheet that collects a choice, such as print, share or assign.
  sheet,
}

/// One dialog from the approved screen inventory.
class DialogSpec {
  /// Creates a dialog description. Only the generator calls this.
  const DialogSpec({
    required this.id,
    required this.name,
    required this.purpose,
    required this.slug,
    required this.tone,
    this.opens = const [],
  });

  /// The dialog number, such as D16-03.
  final String id;

  /// The dialog title.
  final String name;

  /// What the dialog is for, in one line.
  final String purpose;

  /// The `?dialog=` value that opens it over the current screen.
  final String slug;

  /// How the dialog looks.
  final DialogTone tone;

  /// Screens the dialog leads to after confirming.
  final List<String> opens;
}
