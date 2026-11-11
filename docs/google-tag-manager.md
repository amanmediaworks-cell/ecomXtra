# Google Tag Manager setup

The site loads GTM container `GTM-WGBGWTTN` once from `index.html`. The same HTML template is used for client-rendered and Vercel SSR routes. Before the GTM loader runs, the page sets Google Consent Mode defaults to denied for analytics and advertising storage. The noscript iframe is immediately after the opening body tag.

GA4 is not loaded with `gtag.js` and is not hard-coded as a separate installation. Configure the GA4 tag inside GTM with Measurement ID `G-DPG068QHD2`.

## Consent behavior

- On a visitor's first visit, analytics and advertising consent remain denied and conversion/page-view events are not pushed to the data layer.
- The site presents **Allow analytics** and **Reject optional** choices. Only the visitor's explicit choice updates `analytics_storage`; advertising consent remains denied either way.
- The choice is stored in local storage as `ecomxtra_analytics_consent`. If storage is unavailable, the selected choice applies for the current page and the failure is logged.
- With consent accepted, the site emits one `page_view` data-layer event for each React Router pathname. Query strings are excluded; only recognized public route patterns are sent, and the page title is the fixed string `EcomXtra`. The initial route is sent after consent is restored or granted.
- `contact_form_submit`, `whatsapp_click`, and `phone_click` remain consent-gated and send only a fixed event name and an allowlisted `event_source`. No form fields, phone numbers, or WhatsApp message content are sent.
- A WhatsApp click is only a click. `generate_lead` is not an allowed client event and must not be used until a confirmed lead-submission flow exists.
- The required GTM noscript fallback remains in the document. Do not configure noscript tracking tags: a visitor without JavaScript cannot make the consent choice.

## GTM configuration

1. In GTM, add the Google tag for `G-DPG068QHD2`. Disable its automatic page view (`send_page_view: false`) to prevent duplicate initial and history page views.
2. Add a GA4 Event tag named `page_view`, triggered by a Custom Event named `page_view`, with `page_location` and `page_title` mapped from the data layer. Require `analytics_storage` consent for the tag. Do not add a separate History Change trigger; the app already emits one page-view event per route.
3. Add GA4 Event tags for `contact_form_submit`, `whatsapp_click`, and `phone_click`, each triggered by its matching Custom Event. Map only `event_source`; do not add form, contact, message, or outbound URL variables.
4. Do not mark WhatsApp clicks as `generate_lead` or as a confirmed lead. Configure a lead conversion only after the application can confirm an actual submission.
5. Use GTM Preview and browser network inspection to verify that no GA4 event fires before consent, accepting/rejecting updates consent as expected, and client-side navigation produces exactly one page view per pathname.

The GTM container's published configuration is managed in Google Tag Manager and cannot be verified or changed by this repository. In particular, this repository cannot confirm whether the existing Google tag disables automatic page views, whether another Page View/History Change trigger duplicates the app events, or whether the GA4 Measurement ID is correct in the published container. Verify these in GTM Preview before production deployment.
