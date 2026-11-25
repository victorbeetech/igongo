// Every outside service the system is built for. The super admin pastes the
// keys on the Connection settings page; nothing is typed in code. Field
// labels follow each provider's own dashboard so the keys are easy to find.

import type { ProviderSpec } from "./providerSpec";

/** Every provider, grouped by what it is for. */
export const PROVIDERS: ProviderSpec[] = [
  // Payments: each method also has its own on and off switch under Payments > Payment methods.
  { slug: "mtn-momo", name: "MTN Mobile Money", group: "Payments", use: "Collect payments by MoMo prompt", sandbox: true, webhook: true, fields: [
    { label: "Collection subscription key", hint: "Primary key from the MoMo developer portal", secret: true },
    { label: "API user", hint: "A UUID made for Igongo" },
    { label: "API key", hint: "Made for the API user", secret: true },
    { label: "Target environment", hint: "sandbox, or mtnuganda when live" },
  ] },
  { slug: "airtel-money", name: "Airtel Money", group: "Payments", use: "Collect payments by Airtel prompt", sandbox: true, webhook: true, fields: [
    { label: "Client ID", hint: "From the Airtel Africa developer portal" },
    { label: "Client secret", hint: "From the same app", secret: true },
    { label: "Country and currency", hint: "UG and UGX" },
  ] },
  { slug: "flutterwave", name: "Flutterwave", group: "Payments", use: "Cards, and mobile money as a backup", sandbox: true, webhook: true, fields: [
    { label: "Public key", hint: "FLWPUBK-..." },
    { label: "Secret key", hint: "FLWSECK-...", secret: true },
    { label: "Encryption key", hint: "From Settings > API keys", secret: true },
    { label: "Webhook secret hash", hint: "Any long phrase; paste the same in Flutterwave", secret: true },
  ] },
  // Messages to staff and guests.
  { slug: "africas-talking", name: "Africa's Talking", group: "Messages", use: "SMS and one-time codes", sandbox: true, webhook: true, fields: [
    { label: "Username", hint: "sandbox, or the live app name" },
    { label: "API key", hint: "From the Africa's Talking dashboard", secret: true },
    { label: "Sender ID", hint: "IGONGO, once approved" },
  ] },
  { slug: "whatsapp", name: "WhatsApp Business (Meta)", group: "Messages", use: "WhatsApp messages and the concierge", sandbox: false, webhook: true, fields: [
    { label: "Phone number ID", hint: "From the WhatsApp Business app in Meta" },
    { label: "Business account ID", hint: "WABA ID" },
    { label: "Permanent access token", hint: "From a system user", secret: true },
    { label: "Webhook verify token", hint: "Any long phrase; paste the same in Meta", secret: true },
  ] },
  { slug: "firebase", name: "Firebase Cloud Messaging", group: "Messages", use: "Push notifications on phones", sandbox: false, webhook: false, fields: [
    { label: "Project ID", hint: "From the Firebase project settings" },
    { label: "Service account JSON", hint: "Paste the whole file", secret: true },
  ] },
  // Sign-in methods, each also switched on or off under Users & Login.
  { slug: "google-sign-in", name: "Google sign-in", group: "Sign-in", use: "Sign in with Google", sandbox: false, webhook: false, fields: [
    { label: "Web client ID", hint: "...apps.googleusercontent.com" },
    { label: "Client secret", hint: "From Google Cloud > Credentials", secret: true },
    { label: "Android and iOS client IDs", hint: "One per app" },
  ] },
  { slug: "apple-sign-in", name: "Sign in with Apple", group: "Sign-in", use: "Sign in with Apple", sandbox: false, webhook: false, fields: [
    { label: "Services ID", hint: "com.igongo.web" },
    { label: "Team ID", hint: "10 characters" },
    { label: "Key ID", hint: "10 characters" },
    { label: "Private key (.p8)", hint: "Paste the whole key", secret: true },
  ] },
  // Maps and monitoring.
  { slug: "google-maps", name: "Google Maps", group: "Maps", use: "Delivery maps and rider tracking", sandbox: false, webhook: false, fields: [
    { label: "API key", hint: "Restricted to Igongo's apps and site", secret: true },
  ] },
  { slug: "sentry", name: "Sentry", group: "Monitoring", use: "Error reports from the app, web and API", sandbox: false, webhook: false, fields: [
    { label: "DSN", hint: "https://...@sentry.io/..." },
    { label: "Environment", hint: "staging or production" },
  ] },
];

/** The provider with [slug], or the first one when it is missing or unknown. */
export function providerBySlug(slug: string | null): ProviderSpec {
  return PROVIDERS.find((p) => p.slug === slug) ?? PROVIDERS[0]!;
}
