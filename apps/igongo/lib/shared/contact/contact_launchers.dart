// Opens the phone dialler or the email app for a contact channel.
// Every call and email button on the Contact Us screen goes through these two
// functions, so the failure notice is the same everywhere.

import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../ui/toast/igongo_toast.dart';

/// Opens the phone dialler with [number] ready to call. Shows a notice if it cannot open.
Future<void> callNumber(BuildContext context, String number) async {
  // Step 1: a tel: link, which the phone app handles.
  final opened = await launchUrl(Uri(scheme: 'tel', path: number)).catchError((_) => false);
  // Step 2: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open the phone app.');
}

/// Opens the email app with a new message to [address]. Shows a notice if it cannot open.
Future<void> emailAddress(BuildContext context, String address) async {
  // Step 1: a mailto: link to the address.
  final opened = await launchUrl(Uri(scheme: 'mailto', path: address)).catchError((_) => false);
  // Step 2: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open the email app.');
}
