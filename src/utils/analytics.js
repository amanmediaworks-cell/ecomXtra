const CONVERSION_EVENTS = new Set([
  'contact_form_submit',
  'whatsapp_click',
  'phone_click',
])

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
}
const SAFE_PAGE_PATH = /^\/(?:philosophy|showcase|services|blog|testimonials|contact|services\/[a-z0-9-]+(?:\/onboarding)?|blog\/[a-z0-9-]+)?$/i
const SENSITIVE_PATH_VALUE = /(?:@|%[0-9a-f]{2}|\d{7,})/i
let lastTrackedPagePath = null

export function setAnalyticsConsent(granted) {
  if (typeof window === 'undefined') return false

  const consentGranted = granted === true
  window.__ECOMXTRA_ANALYTICS_CONSENT__ = consentGranted
  if (!consentGranted) lastTrackedPagePath = null
  if (typeof window.gtag !== 'function') return false

  window.gtag(
    'consent',
    'update',
    {
      ...DENIED_CONSENT,
      analytics_storage: consentGranted ? 'granted' : 'denied',
    },
  )
  return true
}

export function trackPageView(pathname) {
  if (typeof window === 'undefined') return false
  if (window.__ECOMXTRA_ANALYTICS_CONSENT__ !== true || !Array.isArray(window.dataLayer)) return false
  if (typeof pathname !== 'string' || !pathname.startsWith('/')) return false

  const pagePath = pathname.split(/[?#]/, 1)[0] || '/'
  if (!SAFE_PAGE_PATH.test(pagePath) || SENSITIVE_PATH_VALUE.test(pagePath)) return false
  if (pagePath === lastTrackedPagePath) return false
  lastTrackedPagePath = pagePath
  window.dataLayer.push({
    event: 'page_view',
    page_location: `${window.location.origin}${pagePath}`,
    page_title: 'EcomXtra',
  })
  return true
}

export function trackConversionEvent(event, source) {
  if (!CONVERSION_EVENTS.has(event) || typeof window === 'undefined') return false
  if (window.__ECOMXTRA_ANALYTICS_CONSENT__ !== true || !Array.isArray(window.dataLayer)) return false

  const safeSource = typeof source === 'string' && /^[a-z0-9_]{1,48}$/.test(source)
    ? source
    : 'unknown'
  window.dataLayer.push({ event, event_source: safeSource })
  return true
}
