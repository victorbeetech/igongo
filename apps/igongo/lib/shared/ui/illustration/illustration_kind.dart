// The state illustrations of the brand kit (packages/brand/illustrations).

/// Which drawing a state message shows above its title.
enum IllustrationKind {
  /// An empty woven basket: nothing here yet.
  empty('empty'),

  /// A cracked cup: something went wrong.
  error('error'),

  /// A crossed-out cloud: no connection.
  offline('offline'),

  /// A ticked circle: done.
  success('success'),

  /// A padlock: the role cannot open this.
  denied('denied'),

  /// A map pin: the page does not exist.
  notFound('not-found');

  const IllustrationKind(this.file);

  /// The SVG's name in the brand kit, without `.svg`.
  final String file;

  /// The drawing for a result screen called [name], such as "Page not found"
  /// or "Booking confirmed", or null when an icon suits it better.
  static IllustrationKind? forName(String name) {
    final n = name.toLowerCase();
    // Each rule is checked in order; the first match wins.
    if (n.contains('not found')) return notFound;
    if (n.contains('went wrong') || n.contains('failed')) return error;
    if (RegExp(r'(denied|locked|no access)').hasMatch(n)) return denied;
    if (RegExp(r'(offline|no connection)').hasMatch(n)) return offline;
    if (RegExp(r'(confirmed|placed|sent|done|success)').hasMatch(n)) return success;
    return null;
  }
}
