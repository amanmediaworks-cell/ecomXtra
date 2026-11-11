const CONVERSION_EVENTS = new Set([
  'contact_form_submit',
  'whatsapp_click',
  'phone_click',
])

const SAFE_PAGE_PATH = /^\/(?:philosophy|showcase|services|blog|testimonials|contact|services\/[a-z0-9-]+(?:\/onboarding)?|blog\/[a-z0-9-]+)?$/i
const SENSITIVE_PATH_VALUE = /(?:@|%[0-9a-f]{2}|\d{7,})/i
const SAFE_LABEL = /^[a-zA-Z0-9 _-]{1,80}$/
const SAFE_LOCATION = /^[a-z0-9_-]{1,48}$/
let lastTrackedPagePath = null

const DENIED_CONSENT = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
}

function getSafePagePath(pathname = window.location.pathname) {
  if (typeof pathname !== 'string') return ''
  const pagePath = pathname.split(/[?#]/, 1)[0] || '/'
  return SAFE_PAGE_PATH.test(pagePath) && !SENSITIVE_PATH_VALUE.test(pagePath)
    ? pagePath
    : ''
}

function safeValue(value, pattern) {
  return typeof value === 'string' && pattern.test(value) ? value.trim() : ''
}

export function setAnalyticsConsent(granted) {
  if (typeof window === 'undefined') return false

  const consentGranted = granted === true
  window.__ECOMXTRA_ANALYTICS_CONSENT__ = consentGranted
  if (!consentGranted) lastTrackedPagePath = null
  if (typeof window.gtag !== 'function') return false

  window.gtag('consent', 'update', {
    ...DENIED_CONSENT,
    analytics_storage: consentGranted ? 'granted' : 'denied',
  })
  return true
}

export function trackPageView(pathname) {
  if (typeof window === 'undefined') return false
  if (window.__ECOMXTRA_ANALYTICS_CONSENT__ !== true || !Array.isArray(window.dataLayer)) return false

  const pagePath = getSafePagePath(pathname)
  if (!pagePath || pagePath === lastTrackedPagePath) return false
  lastTrackedPagePath = pagePath
  window.dataLayer.push({
    event: 'page_view',
    page_location: `${window.location.origin}${pagePath}`,
    page_title: 'EcomXtra',
  })
  return true
}

export function trackConversionEvent(event, details = {}) {
  if (!CONVERSION_EVENTS.has(event) || typeof window === 'undefined') return false
  if (window.__ECOMXTRA_ANALYTICS_CONSENT__ !== true || !Array.isArray(window.dataLayer)) return false

  const pagePath = getSafePagePath(details.pagePath)
  if (!pagePath) return false

  let payload
  if (event === 'whatsapp_click') {
    const buttonText = safeValue(details.buttonText, SAFE_LABEL)
    const buttonLocation = safeValue(details.buttonLocation, SAFE_LOCATION)
    const serviceName = safeValue(details.serviceName, SAFE_LABEL)
    if (!buttonText || !buttonLocation) return false
    payload = {
      event,
      button_text: buttonText,
      button_location: buttonLocation,
      page_path: pagePath,
      ...(serviceName ? { service_name: serviceName } : {}),
    }
  } else if (event === 'phone_click') {
    const buttonLocation = safeValue(details.buttonLocation, SAFE_LOCATION)
    if (!buttonLocation) return false
    payload = { event, button_location: buttonLocation, page_path: pagePath }
  } else {
    const formId = safeValue(details.formId, SAFE_LOCATION)
    const formLocation = safeValue(details.formLocation, SAFE_LOCATION)
    const serviceName = safeValue(details.serviceName, SAFE_LABEL)
    if (!formId || !formLocation) return false
    payload = {
      event,
      form_id: formId,
      form_location: formLocation,
      page_path: pagePath,
      ...(serviceName ? { service_name: serviceName } : {}),
    }
  }

  window.dataLayer.push(payload)
  return true
}
