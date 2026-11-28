// Opens the phone dialler or the email app for a contact channel.
// Every call and email button on the Contact Us screen goes through these
// functions, so the notices are the same everywhere.

import 'package:material_ui/material_ui.dart';
import 'package:url_launcher/url_launcher.dart';

import '../ui/toast/igongo_toast.dart';

/// Opens the phone dialler with [number] ready to call. Says so if the hotel has not set the number.
Future<void> callNumber(BuildContext context, String number) async {
  // Step 1: no number set by the super admin yet, so say so instead of dialling nothing.
  if (number.trim().isEmpty) {
    showIgongoToast(context, 'This number is not set yet.');
    return;
  }
  // Step 2: a tel: link, which the phone app handles.
  final opened = await launchUrl(Uri(scheme: 'tel', path: number)).catchError((_) => false);
  // Step 3: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open the phone app.');
}

/// Opens the email app with a new message to [address]. Says so if the hotel has not set the address.
Future<void> emailAddress(BuildContext context, String address) async {
  // Step 1: no address set yet.
  if (address.trim().isEmpty) {
    showIgongoToast(context, 'This email address is not set yet.');
    return;
  }
  // Step 2: a mailto: link to the address.
  final opened = await launchUrl(Uri(scheme: 'mailto', path: address)).catchError((_) => false);
  // Step 3: if it did not open, tell the person (only if the screen is still there).
  if (!opened && context.mounted) showIgongoToast(context, 'Could not open the email app.');
}
