import { trackConversionEvent } from './analytics.js'

const DEFAULT_WHATSAPP_NUMBER = '918700259557'
const DEFAULT_PHONE_NUMBER = '+91 8700259557'

export function openWhatsAppMessage(
  message,
  whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
  source = 'contact',
) {
  trackConversionEvent('whatsapp_click', source)
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function getTelephoneHref(phoneNumber = DEFAULT_PHONE_NUMBER) {
  const normalized = String(phoneNumber || DEFAULT_PHONE_NUMBER).replace(/[^\d+]/g, '')
  return `tel:${/^\+?\d{7,15}$/.test(normalized)
    ? normalized
    : DEFAULT_PHONE_NUMBER.replace(/[^\d+]/g, '')}`
}
