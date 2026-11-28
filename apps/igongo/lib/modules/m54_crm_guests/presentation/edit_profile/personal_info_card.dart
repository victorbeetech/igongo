// The Personal Information card: full name, phone, email and preferred
// accommodation. Each field has its label, a hint and a leading icon.

import 'package:igongo_tokens/igongo_tokens.dart';
import 'package:material_ui/material_ui.dart';

import '../../../../../shared/theme/theme.dart';
import '../../../../../shared/ui/card/igongo_card.dart';
import '../../../../../shared/ui/field/igongo_hint_field.dart';
import '../../../../../shared/ui/section/igongo_card_title.dart';

/// The personal details group.
class PersonalInfoCard extends StatelessWidget {
  /// Creates the card from the four text controllers.
  const PersonalInfoCard({
    super.key,
    required this.name,
    required this.phone,
    required this.email,
    required this.accommodation,
  });

  /// Holds the full name.
  final TextEditingController name;

  /// Holds the phone number.
  final TextEditingController phone;

  /// Holds the email address.
  final TextEditingController email;

  /// Holds the preferred room or cottage.
  final TextEditingController accommodation;

  @override
  Widget build(BuildContext context) {
    final p = context.palette;
    return IgongoCard(
      padding: const EdgeInsets.all(IgongoSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: IgongoSpace.lg,
        children: [
          const IgongoCardTitle(icon: Icons.badge_outlined, title: 'Personal Information'),
          IgongoHintField(
            label: 'Full Name',
            hint: 'Required',
            icon: Icons.person_outline,
            placeholder: 'Enter your full name',
            controller: name,
          ),
          IgongoHintField(
            label: 'Phone Number',
            hint: 'For booking SMS',
            icon: Icons.call_outlined,
            placeholder: '+256 700 000 000',
            controller: phone,
            keyboardType: TextInputType.phone,
          ),
          IgongoHintField(
            label: 'Email Address',
            hint: 'Invoices & Folios',
            icon: Icons.alternate_email,
            placeholder: 'name@domain.com',
            controller: email,
            keyboardType: TextInputType.emailAddress,
          ),
          IgongoHintField(
            label: 'Preferred Accommodation',
            hint: 'Subject to availability',
            hintColor: p.accent,
            icon: Icons.cottage_outlined,
            placeholder: 'e.g. Executive Suite or Valley Cottage',
            controller: accommodation,
          ),
        ],
      ),
    );
  }
}
