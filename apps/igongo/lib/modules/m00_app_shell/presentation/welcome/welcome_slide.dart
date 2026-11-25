// One slide of the first-run welcome.

/// The words of one welcome slide.
class WelcomeSlide {
  /// Creates a slide with a [title] and a [body].
  const WelcomeSlide(this.title, this.body);

  /// The headline, shown in the brand font.
  final String title;

  /// One or two lines under it.
  final String body;

  /// The three slides, in order.
  static const all = [
    WelcomeSlide('Welcome to Igongo', 'One app for the hotel, the museum, dining, events and the pool.'),
    WelcomeSlide('Book and order', 'Book a room or a tour, order food to your room or table, and pay by mobile money.'),
    WelcomeSlide('For our team too', 'Staff clock in, file reports and see their pay, all in the same app.'),
  ];
}
