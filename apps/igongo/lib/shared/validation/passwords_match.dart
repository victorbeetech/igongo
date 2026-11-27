// The check that the two password boxes hold the same text. Kept in one place
// so the sign-up screen and any other form use the same rule and message.

/// The message shown when the password and its "again" box differ.
const String passwordsDifferMessage = 'The two passwords are not the same.';

/// True when [password] and [again] hold exactly the same text.
/// Case and spaces count: the check is exact, the same as the server's.
bool passwordsMatch(String password, String again) => password == again;
