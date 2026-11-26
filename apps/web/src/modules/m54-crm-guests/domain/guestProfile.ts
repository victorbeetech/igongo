// A guest's profile, as the CRM API returns it (modules/crm-guests).

export interface GuestProfile {
  id: string;
  userId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  birthday: string | null;
  preferences: string | null;
  allergies: string | null;
  tags: string[];
  consent: { sms: boolean; whatsapp: boolean; email: boolean; changedAt: string | null };
  updatedAt: string;
}
