// The hand-made screens of module 00, by screen number. Every other screen
// of the module uses a shared layout from its kind.

import '../../shared/catalog/catalog.dart';
import 'presentation/active_sessions/active_sessions_screen.dart';
import 'presentation/create_account/create_account_screen.dart';
import 'presentation/forgot_password/forgot_password_screen.dart';
import 'presentation/my_profile/my_profile_screen.dart';
import 'presentation/role_home/role_home_screen.dart';
import 'presentation/sign_in/sign_in_screen.dart';
import 'presentation/splash/splash_screen.dart';
import 'presentation/text_size/text_size_screen.dart';
import 'presentation/theme/theme_screen.dart';
import 'presentation/welcome/welcome_screen.dart';

/// Module 00's hand-made screens.
final m00Overrides = <String, ScreenOverride>{
  'S00-01': (_, s) => SplashScreen(s),
  'S00-02': (_, s) => WelcomeScreen(s),
  'S00-05': (_, s) => SignInScreen(s),
  'S00-17': (_, s) => ForgotPasswordScreen(s),
  'S00-18': (_, s) => CreateAccountScreen(s),
  'S00-21': (_, s) => RoleHomeScreen(s),
  'S00-31': (_, s) => MyProfileScreen(s),
  'S00-32': (_, s) => MyProfileScreen(s),
  'S00-33': (_, s) => TextSizeScreen(s),
  'S00-34': (_, s) => ThemeScreen(s),
  'S00-36': (_, s) => ActiveSessionsScreen(s),
};
