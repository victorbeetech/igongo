// The states every screen must design for. In this prototype they are picked
// from the preview panel; later the data layer sets them.

/// One state a screen can be in.
enum ViewState {
  /// The screen with its content.
  normal('Normal'),

  /// Content is on its way: skeleton rows and the brand spiral.
  loading('Loading'),

  /// Nothing to show yet, with how to add the first one.
  empty('Empty'),

  /// Something failed, with Try again and Report.
  error('Error'),

  /// No network: saved items show, new ones queue and sync later.
  offline('Offline'),

  /// The person's role cannot open this screen.
  denied('Permission denied'),

  /// A step finished, with what happens next.
  success('Success');

  const ViewState(this.label);

  /// The name shown in the preview panel.
  final String label;
}
