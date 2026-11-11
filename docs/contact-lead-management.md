# Contact lead management

## Contact and analytics behavior

- Contact/consultation CTAs open WhatsApp directly outside `/contact`; service pages include the service name in the prefilled message.
- On `/contact`, those CTAs open the contact modal. Submitting that enquiry stores the request and creates its admin notification; it does not open WhatsApp.
- Telephone links emit `phone_click`. Explicit WhatsApp CTAs emit `whatsapp_click`. A successfully persisted contact enquiry emits `contact_form_submit`. These events are separate and contain no submitted name, phone, email, or message.
- Consent-gated analytics remains in place. GTM/GA4 tags should use `whatsapp_click`, `phone_click`, and `contact_form_submit` as distinct custom events; a WhatsApp click is not a confirmed lead.
- Career applications remain a separate WhatsApp hand-off and do not emit any of the three contact conversion events.

## Supabase setup

The migration `supabase/migrations/20261112000000_contact_lead_management.sql` is not applied automatically. Before applying it:

1. Replace `REPLACE_WITH_EXISTING_ADMIN_AUTH_UID` with the UUID of an authorized Supabase Auth user. Add one row per authorized admin. Do not use an email address or service-role key.
2. Review and apply the migration after the project's previously required migrations. Do not apply it until the admin UUID has been confirmed.
3. Configure the Vercel server environment with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CONTACT_RATE_LIMIT_SECRET`. The secret must contain at least 32 characters. Keep all three server-only; never expose the service-role key through a `VITE_` variable.

The contact API uses the service role only on the server, validates and normalizes submissions, applies a per-address hourly rate limit, and creates the lead and notification transactionally with an idempotency key. Contact values are stored in Supabase and are not sent to analytics.

## Admin inbox

After the migration is applied and the signed-in user is in `contact_admin_users`, the admin header bell opens the lead inbox. The inbox has unread counts, latest-10 keyset pagination, read/unread and bulk actions, filters, search, date range and due follow-up filtering, status/priority/follow-up editing, call and WhatsApp actions, lead details, private notes, and activity history. Realtime notification updates are reconciled with 30-second polling.

Lead tables are protected by row-level security. The read and metrics RPCs reject users who are not in the admin allowlist. No migration, Vercel deployment, or GTM container publication is performed by these instructions.
