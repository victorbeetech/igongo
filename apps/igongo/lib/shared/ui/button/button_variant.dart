// The four kinds of Igongo button.

/// How a button looks, by how important its action is.
enum ButtonVariant {
  /// The main action of a screen: filled Igongo red.
  primary,

  /// A second action: outlined.
  secondary,

  /// An action that removes or stops something: filled in the error colour.
  danger,

  /// A quiet action, such as Cancel: text only.
  text,
}
